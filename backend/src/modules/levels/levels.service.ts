
import {
  Injectable,
  OnModuleInit,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

const LEVELS = [
  { levelNumber: 14, name: 'First Fire', threshold: 0 },
  { levelNumber: 12, name: 'Survival', threshold: 10 },
  { levelNumber: 11, name: 'Civilization', threshold: 20 },
  { levelNumber: 10, name: 'Industrial', threshold: 30 },
  { levelNumber: 8, name: 'Electrical', threshold: 40 },
  { levelNumber: 7, name: 'Modern', threshold: 50 },
  { levelNumber: 5, name: 'Digital', threshold: 60 },
  { levelNumber: 4, name: 'AI', threshold: 70 },
  { levelNumber: 2, name: 'Space', threshold: 80 },
  { levelNumber: 1, name: 'Mars', threshold: 90 },
];

const clamp = (value: number) =>
  Math.max(0, Math.min(100, value));

const average = (values: number[]) =>
  values.length
    ? values.reduce((sum, value) => sum + value, 0) /
      values.length
    : 0;

@Injectable()
export class LevelsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  // Ensure all configured levels exist before requests are handled.
  async onModuleInit() {
    for (const level of LEVELS) {
      await this.prisma.level.upsert({
        where: { levelNumber: level.levelNumber },
        update: {
          name: level.name,
          scoreThreshold: level.threshold,
        },
        create: {
          levelNumber: level.levelNumber,
          name: level.name,
          scoreThreshold: level.threshold,
        },
      });
    }
  }

  async getAllLevels() {
    return this.prisma.level.findMany({
      orderBy: { scoreThreshold: 'asc' },
    });
  }

  async getUserLevel(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { level: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      userId: user.id,
      score: Number(user.score),
      levelNumber: user.levelNumber,
      level: user.level,
    };
  }

  async recalculateUserLevel(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [evidence, userSkills, receivedAcks, givenAckCount] =
      await Promise.all([
        this.prisma.evidence.findMany({
          where: { userId },
          select: {
            type: true,
            verificationStatus: true,
          },
        }),

        this.prisma.userSkill.findMany({
          where: { userId },
          select: { yearsExperience: true },
        }),

        this.prisma.acknowledgement.findMany({
          where: { toUserId: userId },
          select: { weight: true },
        }),

        this.prisma.acknowledgement.count({
          where: { fromUserId: userId },
        }),
      ]);

    // 1. Evidence quality: verified evidence gets the most credit.
    const evidenceQuality = {
      VERIFIED: 100,
      PENDING: 40,
      UNVERIFIED: 20,
      REJECTED: 0,
    };

    const evidenceScore = average(
      evidence.map(
        (item) => evidenceQuality[item.verificationStatus],
      ),
    );

    // 2. Demonstrated work: use relevant evidence types as a proxy.
    // Each distinct submitted item adds credit, up to 100.
    const workTypes = [
      'PROJECT',
      'PORTFOLIO',
      'RESEARCH',
      'ACHIEVEMENT',
    ];

    const workCount = evidence.filter((item) =>
      workTypes.includes(item.type),
    ).length;

    const projectScore = clamp(workCount * 25);

    // 3. Recognition: acknowledgement weight, capped at 100.
    const totalRecognitionWeight = receivedAcks.reduce(
      (sum, ack) => sum + Number(ack.weight),
      0,
    );

    const recognitionScore = clamp(
      totalRecognitionWeight * 10,
    );

    // 4. Experience: use the maximum declared experience across skills.
    // This avoids adding the same years together across multiple skills.
    const maxYears = Math.max(
      0,
      ...userSkills.map((skill) =>
        Number(skill.yearsExperience ?? 0),
      ),
    );

    const experienceScore = clamp((maxYears / 10) * 100);

    // 5. Trust and activity: trustScore is assumed to be in [0, 1].
    // Activity is estimated because no dedicated activity model exists yet.
    const trustScore = clamp(
      Number(user.trustScore) * 100,
    );

    const activityScore = clamp(
      evidence.length * 10 + givenAckCount * 5,
    );

    const trustAndActivityScore =
      trustScore * 0.7 + activityScore * 0.3;

    // Final score, between 0 and 100.
    const score = Number(
      (
        evidenceScore * 0.30 +
        projectScore * 0.25 +
        recognitionScore * 0.20 +
        experienceScore * 0.15 +
        trustAndActivityScore * 0.10
      ).toFixed(2),
    );

    // The highest qualifying threshold determines the level.
    // Since level 1 is the most advanced, thresholds are ascending
    // while level numbers descend.
    const eligibleLevel = await this.prisma.level.findFirst({
      where: {
        scoreThreshold: { lte: score },
      },
      orderBy: { scoreThreshold: 'desc' },
    });

    if (!eligibleLevel) {
      throw new Error(
        'No eligible level found. Check level thresholds.',
      );
    }

    const levelChanged =
      user.levelNumber !== eligibleLevel.levelNumber;

    // Save the score, level, and history atomically.
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          score,
          levelNumber: eligibleLevel.levelNumber,
        },
      });

      // History records actual level changes, not every score update.
      if (levelChanged) {
        await tx.levelHistory.create({
          data: {
            userId,
            levelNumber: eligibleLevel.levelNumber,
            scoreAtTime: score,
          },
        });
      }
    });

    return {
      userId,
      score,
      previousLevel: user.levelNumber,
      currentLevel: eligibleLevel.levelNumber,
      levelName: eligibleLevel.name,
      levelChanged,
      breakdown: {
        evidence: Number(evidenceScore.toFixed(2)),
        projectsAndWork: projectScore,
        recognition: Number(recognitionScore.toFixed(2)),
        experience: experienceScore,
        trustAndActivity: Number(
          trustAndActivityScore.toFixed(2),
        ),
      },
    };
  }
}

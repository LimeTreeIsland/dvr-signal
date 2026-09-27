export type SuppressionReason =
  | "primary_small_cell"
  | "secondary_reconstruction_protection"
  | null;

export interface AggregateCell {
  key: string;
  count: number;
}

export interface SuppressedCell extends AggregateCell {
  visible: boolean;
  reason: SuppressionReason;
}

export interface CategoricalSuppressionResult {
  cells: SuppressedCell[];
  total: number | null;
  totalVisible: boolean;
  minimumPublicCellN: number;
}

function requireNonnegativeInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a nonnegative integer`);
  }
}

export function suppressCategoricalCells(
  cells: AggregateCell[],
  options: {
    minimumPublicCellN?: number;
    total?: number;
    protectReconstruction?: boolean;
  } = {},
): CategoricalSuppressionResult {
  const minimumPublicCellN = options.minimumPublicCellN ?? 10;
  const protectReconstruction = options.protectReconstruction ?? true;

  requireNonnegativeInteger(minimumPublicCellN, "minimumPublicCellN");
  if (minimumPublicCellN < 1) throw new Error("minimumPublicCellN must be at least 1");

  for (const cell of cells) requireNonnegativeInteger(cell.count, `count for ${cell.key}`);

  const summed = cells.reduce((sum, cell) => sum + cell.count, 0);
  const total = options.total ?? summed;
  requireNonnegativeInteger(total, "total");
  if (total < summed) throw new Error("total cannot be smaller than the sum of supplied cells");

  const result: SuppressedCell[] = cells.map((cell) => ({
    ...cell,
    visible: cell.count >= minimumPublicCellN,
    reason: cell.count < minimumPublicCellN ? "primary_small_cell" : null,
  }));

  let totalVisible = true;

  if (protectReconstruction) {
    const hidden = result.filter((cell) => !cell.visible);
    const visible = result.filter((cell) => cell.visible);

    if (hidden.length === 1) {
      if (visible.length > 0) {
        const secondary = [...visible].sort(
          (a, b) => a.count - b.count || a.key.localeCompare(b.key),
        )[0];
        secondary.visible = false;
        secondary.reason = "secondary_reconstruction_protection";
      } else {
        totalVisible = false;
      }
    }

    const finalHidden = result.filter((cell) => !cell.visible);
    if (finalHidden.length === 1) totalVisible = false;
  }

  return {
    cells: result,
    total,
    totalVisible,
    minimumPublicCellN,
  };
}

export interface BinaryPercentageResult {
  reportable: boolean;
  numerator: number | null;
  denominator: number | null;
  percentage: number | null;
  reason:
    | null
    | "denominator_below_minimum"
    | "numerator_below_minimum"
    | "complement_below_minimum";
}

export function evaluateBinaryPercentage(
  numerator: number,
  denominator: number,
  options: {
    minimumCellN?: number;
    minimumDenominator?: number;
  } = {},
): BinaryPercentageResult {
  const minimumCellN = options.minimumCellN ?? 10;
  const minimumDenominator = options.minimumDenominator ?? minimumCellN * 2;

  requireNonnegativeInteger(numerator, "numerator");
  requireNonnegativeInteger(denominator, "denominator");
  if (numerator > denominator) throw new Error("numerator cannot exceed denominator");

  if (denominator < minimumDenominator) {
    return {
      reportable: false,
      numerator: null,
      denominator: null,
      percentage: null,
      reason: "denominator_below_minimum",
    };
  }

  if (numerator < minimumCellN) {
    return {
      reportable: false,
      numerator: null,
      denominator: null,
      percentage: null,
      reason: "numerator_below_minimum",
    };
  }

  const complement = denominator - numerator;
  if (complement < minimumCellN) {
    return {
      reportable: false,
      numerator: null,
      denominator: null,
      percentage: null,
      reason: "complement_below_minimum",
    };
  }

  return {
    reportable: true,
    numerator,
    denominator,
    percentage: (numerator / denominator) * 100,
    reason: null,
  };
}

export type StatisticKind = "count_percentage" | "median" | "p75" | "p90" | "survival_tail";

const DEFAULT_STABILITY_THRESHOLDS: Record<StatisticKind, number> = {
  count_percentage: 10,
  median: 10,
  p75: 20,
  p90: 30,
  survival_tail: 10,
};

export function statisticIsDisplayable(
  kind: StatisticKind,
  usableN: number,
  thresholds: Partial<Record<StatisticKind, number>> = {},
): boolean {
  requireNonnegativeInteger(usableN, "usableN");
  const threshold = thresholds[kind] ?? DEFAULT_STABILITY_THRESHOLDS[kind];
  requireNonnegativeInteger(threshold, `threshold for ${kind}`);
  return usableN >= threshold;
}

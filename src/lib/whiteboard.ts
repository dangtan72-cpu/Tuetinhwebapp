export type WhiteboardStroke = {
  id: string;
  color: string;
  width: number;
  points: [number, number][];
  eraser?: boolean;
  by: string;
  byName: string;
};

export function parseWhiteboardData(raw: unknown): WhiteboardStroke[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is WhiteboardStroke => {
    if (!item || typeof item !== "object") return false;
    const s = item as WhiteboardStroke;
    return (
      typeof s.id === "string" &&
      typeof s.color === "string" &&
      typeof s.width === "number" &&
      Array.isArray(s.points) &&
      typeof s.by === "string"
    );
  });
}

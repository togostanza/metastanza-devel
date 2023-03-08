export function straightLink(d, targetAccessor, sourceAccessor) {
  const start = { x: sourceAccessor(d).x, y: sourceAccessor(d).y };
  const end = { x: targetAccessor(d).x, y: targetAccessor(d).y };
  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
}

function rotatePoint(pivot, point, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  point.x -= pivot.x;
  point.y -= pivot.y;

  const newX = point.x * cos - point.y * sin;
  const newY = point.x * sin + point.y * cos;

  point.x = pivot.x + newX;
  point.y = pivot.y + newY;
}

export function curvedLink(d, curveDir, targetAccessor, sourceAccessor) {
  const start = { x: sourceAccessor(d).x, y: sourceAccessor(d).y };
  const end = { x: targetAccessor(d).x, y: targetAccessor(d).y };

  const L = Math.sqrt(
    (start.y - end.y) * (start.y - end.y) +
      (start.x - end.x) * (start.x - end.x)
  );

  const theta = Math.atan((end.y - start.y) / (end.x - start.x));

  const p1 = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };

  rotatePoint(start, p1, -theta);

  p1.y += (L / 5) * curveDir;

  rotatePoint(start, p1, theta);

  return `M ${start.x} ${start.y}
              S ${p1.x} ${p1.y} ${end.x} ${end.y}`;
}

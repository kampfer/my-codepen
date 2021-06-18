import Vector2 from './Vector2.js';

export function random(start, end) {
    return Math.floor((end - start + 1) * Math.random()) + start;
}

// https://pomax.github.io/bezierinfo/#abc
export function u(t) {
    return (1 - t) * (1 - t) / (t * t + (1 - t) * (1 - t));
}

export function u3(t) {
    return Math.pow(1-t, 3) / (t * t * t + Math.pow(1 - t, 3));
}

export function ratio(t) {
    return Math.abs((t * t + (1 - t) * (1 - t) - 1) / (t * t + (1 - t) * (1 - t)));
}

export function ratio3(t) {
    return Math.abs((Math.pow(t, 3) + Math.pow(1- t, 3) - 1) / (Math.pow(t, 3) + Math.pow(1 - t, 3)));
}

export function renderPoint(selection, p, label) {
    selection.append('circle')
        .classed('point', true)
        .attr('cx', p.x)
        .attr('cy', p.y)
        .attr('r', 3);
    selection.append('text')
        .text(label)
        .attr('x', p.x + 10)
        .attr('y', p.y + 10);
}

export function renderCure(selection, p0, p1, p2, arrow="#arrow") {
    selection.append('path')
        .classed('curve', true)
        .attr('fill', 'none')
        .attr('stroke', '#000')
        .attr('marker-end', `url(${arrow})`)
        .attr('d', `M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`);
}

export function renderGrid(selection, gridGap, width, height) {
    const grids = [[], []];
    for(let i = 0, l = Math.ceil(width / gridGap); i < l; i++) {
        grids[0].push([0, i * gridGap, width, i * gridGap]);
        grids[1].push([i * gridGap, 0, i * gridGap, height]);
    }

    selection.append('g')
        .classed('grid', true)
        .selectAll('g')
        .data(grids)
        .join('g')
        .classed('x-graids', (d, i) => i === 0)
        .classed('y-graids', (d, i) => i === 1)
        .selectAll('path')
        .data(d => d)
        .join('path')
        .attr('stroke', '#f0f0f0')
        .attr('fill', 'none')
        .attr('d', d => `M${d[0]} ${d[1]} L${d[2]} ${d[3]}`);
}

export function getIntersectPointBetweenCircleAndLine(p0, p1, c, r) {
    const alpha = (p1.y - p0.y) / (p1.x - p0.x);
    const beta = (p1.x * p0.y - p0.x * p1.y) / (p1.x - p0.x);
    const a = 1 + alpha * alpha;
    const b = -2 * (c.x - alpha * beta + alpha * c.y);
    const _c = c.x * c.x + beta * beta - 2 * beta * c.y + c.y * c.y - r * r;
    const s = b * b - 4 * a * _c;
    if (s < 0) {
        return null;
    } else if (s === 0) {
        const u = -b / (2 * a);
        return new Vector2(u, alpha * u + beta);
    } else {
        const u1 = (-b + Math.sqrt(s)) / (2 * a);
        const u2 = (-b - Math.sqrt(s)) / (2 * a);
        return [
            new Vector2(u1, alpha * u1 + beta),
            new Vector2(u2, alpha * u2 + beta),
        ];
    }
}

export function getIntersectPointBetweenCircleAndSegment(p0, p1, c, r) {
    let points = getIntersectPointBetweenCircleAndLine(p0, p1, c, r);
    if (points) {
        const max = Math.max(p0.x, p1.x);
        const min = Math.min(p0.x, p1.x);
        if (Array.isArray(points)) {
            return points.find(point => point.x >= min && point.x <= max);
        } else {
            return points.x >= min && points.x <= max ? points : null;
        }
    }
    return points;
}

export function intersectLine(p1, p2, p3, p4) {
    const nx = (p1.x * p2.y - p1.y * p2.x) * (p3.x - p4.x) - (p1.x - p2.x) * (p3.x * p4.y - p3.y * p4.x),
          ny = (p1.x * p2.y - p1.y * p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x * p4.y - p3.y * p4.x),
          d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    if (d == 0) return false;
    return new Vector2(nx / d, ny / d);
}

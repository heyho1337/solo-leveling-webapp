/**
 * Helpers for API Platform JSON-LD resources (IRIs, embedded ids, display).
 */

import { Exercise } from "@/Interface/exercise/ExerciseInterface";

const API_V1_BASE =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) || 'http://localhost:8000/api/v1';

export function getResourceId(resource: unknown): string {
  if (resource == null) return '';
  if (typeof resource === 'string') {
    const s = resource.trim();
    if (!s) return '';
    const parts = s.split('/').filter(Boolean);
    return parts[parts.length - 1] ?? '';
  }
  if (typeof resource === 'object') {
    const o = resource as Record<string, unknown>;
    if (o.id != null && String(o.id).length > 0) return String(o.id);
    if (o['@id'] != null) return getResourceId(String(o['@id']));
  }
  return '';
}

/** IRI string for relation properties (matches axios api base URL). */
export function resourceIri(collection: string, id: string): string {
  const slug = collection.replace(/^\//, '').replace(/\/$/, '');
  const base = API_V1_BASE.replace(/\/$/, '');
  return `${base}/${slug}/${id}`;
}

export function buildExerciseMap<T extends Exercise>(exercises: T[]): Record<string, T> {
  const m: Record<string, T> = {};
  for (const ex of exercises) {
    const k = getResourceId(ex);
    if (k) m[k] = ex;
  }
  return m;
}

export function formatWorkoutExercise(
  item: Exercise,
): { label: string; detail: string; description: string } {
  
  const exerciseData = item as Exercise;

  const label = exerciseData?.name;

  const details: string[] = [];
  if (item.setCount != null && item.setCount > 0) {
    details.push(`${item.setCount} set${item.setCount === 1 ? '' : 's'}`);
  }
  if (item.repCount != null && item.repCount > 0) {
    details.push(`${item.repCount} rep${item.repCount === 1 ? '' : 's'}`);
  }
  const wkg = item.weightKg;
  if (wkg != null && Number(wkg) > 0) {
    details.push(`${wkg}kg`);
  }
  if (item.duration != null && item.duration > 0) {
    details.push(`${item.duration}s`);
  }
  if (item.distance != null && item.distance > 0) {
    details.push(`${item.distance}m`);
  }

  if (details.length === 0) {
    if (exerciseData?.category) details.push(exerciseData.category);
    else if (exerciseData?.targetStat) details.push(exerciseData.targetStat);
    else if (!exerciseData) details.push('Configure sets/reps or duration');
    else details.push('No extra data');
  }

  return {
    label,
    detail: details.join(' · '),
    description: exerciseData?.description || '',
  };
}

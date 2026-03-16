import { useState, useEffect } from 'react';
import type { FamilyGroup, FamilyMember } from '@we/utils';

let _group: FamilyGroup | null = null;
const _subs = new Set<() => void>();

function notify() { _subs.forEach(fn => fn()); }

export function setFamilyGroup(g: FamilyGroup | null) {
  _group = g;
  notify();
}

export function addFamilyMember(member: FamilyMember) {
  const today = new Date().toISOString().slice(0, 10);
  _group = _group
    ? { ..._group, members: [..._group.members, member] }
    : { members: [member], groupStartDate: today };
  notify();
}

export function removeFamilyMember(id: string) {
  if (!_group) return;
  const members = _group.members.filter(m => m.id !== id);
  _group = members.length === 0 ? null : { ..._group, members };
  notify();
}

export function useFamilyGroup() {
  const [group, setGroup] = useState(_group);
  useEffect(() => {
    const update = () => setGroup(_group ? { ..._group, members: [..._group.members] } : null);
    _subs.add(update);
    return () => { _subs.delete(update); };
  }, []);
  return { group };
}

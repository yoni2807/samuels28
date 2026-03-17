import { useState, useEffect } from 'react';
import {
  collection, addDoc, onSnapshot, doc,
  updateDoc, arrayUnion, arrayRemove, query, where, getDoc
} from 'firebase/firestore';
import { db } from '../firebase';

export function useGroups(user) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setGroups([]); setLoading(false); return; }

    const q = query(collection(db, 'groups'), where('members', 'array-contains', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const createGroup = async (name) => {
    if (!user) return;
    await addDoc(collection(db, 'groups'), {
      name,
      createdBy: user.uid,
      createdByName: user.displayName,
      members: [user.uid],
      memberNames: { [user.uid]: user.displayName },
      memberPhotos: { [user.uid]: user.photoURL },
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      screenings: [],
      createdAt: new Date().toISOString(),
    });
  };

  const joinGroup = async (inviteCode) => {
    if (!user) return null;
    const q = query(collection(db, 'groups'), where('inviteCode', '==', inviteCode.toUpperCase()));
    const snap = await import('firebase/firestore').then(({ getDocs }) => getDocs(q));
    if (snap.empty) return 'not_found';

    const groupDoc = snap.docs[0];
    await updateDoc(doc(db, 'groups', groupDoc.id), {
      members: arrayUnion(user.uid),
      [`memberNames.${user.uid}`]: user.displayName,
      [`memberPhotos.${user.uid}`]: user.photoURL,
    });
    return 'joined';
  };

  const proposeScreening = async (groupId, movie, date) => {
    if (!user) return;
    const groupRef = doc(db, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);
    const group = groupSnap.data();
    const members = group.members || [];

    const screening = {
      id: Date.now().toString(),
      movieTitle: movie.title,
      movieDirector: movie.director,
      movieYear: movie.year,
      movieGenre: movie.genre,
      date,
      proposedBy: user.uid,
      proposedByName: user.displayName,
      approvals: [user.uid],
      rejections: [],
      totalMembers: members.length,
      status: members.length === 1 ? 'confirmed' : 'pending',
      createdAt: new Date().toISOString(),
    };

    await updateDoc(groupRef, {
      screenings: arrayUnion(screening),
    });
  };

  const respondToScreening = async (groupId, screeningId, approve) => {
    if (!user) return;
    const groupRef = doc(db, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);
    const group = groupSnap.data();

    const updatedScreenings = group.screenings.map(s => {
      if (s.id !== screeningId) return s;
      const approvals = approve
        ? [...new Set([...s.approvals, user.uid])]
        : s.approvals.filter(id => id !== user.uid);
      const rejections = !approve
        ? [...new Set([...s.rejections, user.uid])]
        : s.rejections.filter(id => id !== user.uid);

      const allApproved = approvals.length === s.totalMembers;
      const majorityRejected = rejections.length > s.totalMembers / 2;

      return {
        ...s,
        approvals,
        rejections,
        status: allApproved ? 'confirmed' : majorityRejected ? 'rejected' : 'pending',
      };
    });

    await updateDoc(groupRef, { screenings: updatedScreenings });
  };

  const leaveGroup = async (groupId) => {
    if (!user) return;
    await updateDoc(doc(db, 'groups', groupId), {
      members: arrayRemove(user.uid),
    });
  };

  return { groups, loading, createGroup, joinGroup, proposeScreening, respondToScreening, leaveGroup };
}
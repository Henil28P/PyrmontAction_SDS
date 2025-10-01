import api from "./client";
export async function fetchMemberProfile(){ const {data}=await api.get("/api/member/profile"); return data; }
export async function fetchMemberSummary(){ const {data}=await api.get("/api/member/summary"); return data; }
export async function fetchMinutes(){ const {data}=await api.get("/api/minutes?limit=25"); return data; }
export async function renewMembership(payload){ const {data}=await api.post("/api/member/renew", payload); return data; }
export async function updateDetails(form){ const {data}=await api.put("/api/member/details", form); return data; }

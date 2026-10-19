import { createHash, randomBytes } from "node:crypto";
import { supabase } from "../../config/supabase";
import { AppError } from "../../utils/AppError";

const TABLE = "api_tokens";
export const TOKEN_PREFIX = "sb_pat_";

// Token asli tidak pernah disimpan, hanya hash-nya
export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

// ponytail: satu token per user (generate ulang = token lama mati). Upgrade ke multi-token jika butuh beberapa agent terpisah.
export const mcpTokenService = {
  async generate(userId: string): Promise<{ token: string }> {
    const token = `${TOKEN_PREFIX}${randomBytes(24).toString("base64url")}`;
    const { error } = await supabase.from(TABLE).upsert({
      user_id: userId,
      token_hash: hashToken(token),
      created_at: new Date().toISOString(),
      last_used_at: null,
    });
    if (error) {
      throw new AppError(`Failed to generate API token: ${error.message}`, 500);
    }
    return { token };
  },

  async status(userId: string) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("created_at, last_used_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {
      throw new AppError(`Failed to fetch API token: ${error.message}`, 500);
    }
    return { active: !!data, ...data };
  },

  async revoke(userId: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("user_id", userId);
    if (error) {
      throw new AppError(`Failed to revoke API token: ${error.message}`, 500);
    }
  },

  /** Mengembalikan user_id pemilik token, atau null jika token tidak valid. */
  async verify(token: string): Promise<string | null> {
    if (!token.startsWith(TOKEN_PREFIX)) return null;
    const tokenHash = hashToken(token);
    const { data } = await supabase
      .from(TABLE)
      .select("user_id")
      .eq("token_hash", tokenHash)
      .maybeSingle();
    if (!data) return null;
    await supabase
      .from(TABLE)
      .update({ last_used_at: new Date().toISOString() })
      .eq("token_hash", tokenHash);
    return data.user_id as string;
  },
};

import { z } from "zod";

export const getConversationIdSchema = z.object({
  friend_id: z.number({ 
      required_error: "friend_id is required"
  }),
});


export const getMsgsSchema = z.object({
  id: z.number({ 
      required_error: "conversastion id required"
  }),
});

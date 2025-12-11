import { z } from "zod";



export const ParseIdSchema = z.object({
  id: z.coerce.number().positive(),
});


export const sendMsgSchema = z.object({
    input : z.string().min(1),
    id : z.coerce.number().positive(),
    friend_id : z.coerce.number().positive()
});


export const BlockSchema = z.object({
    conv_id : z.coerce.number().positive(),
    friend_id : z.coerce.number().positive()
});


export const PinnedSchema = z.object({
    id : z.coerce.number().positive(),
    pinned : z.string(),
});


export const usersettings = z.object({
    settingAttribute : z.string(),
    newValue: z.boolean(),
});

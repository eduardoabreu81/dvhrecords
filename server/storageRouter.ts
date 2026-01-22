import { z } from 'zod';
import { protectedProcedure, router } from './_core/trpc';
import { uploadToB2, deleteFromB2 } from './b2Storage';
import { TRPCError } from '@trpc/server';

// Schema para validação de uploads
const uploadSchema = z.object({
  fileBase64: z.string(),
  fileName: z.string(),
  folder: z.enum(['images', 'audio', 'covers']),
  contentType: z.string(),
});

const deleteSchema = z.object({
  fileUrl: z.string().url(),
});

export const storageRouter = router({
  /**
   * Upload de arquivo para B2 (protegido - requer autenticação)
   */
  upload: protectedProcedure
    .input(uploadSchema)
    .mutation(async ({ input }: { input: z.infer<typeof uploadSchema> }) => {
      try {
        // Converter base64 para buffer
        const fileBuffer = Buffer.from(input.fileBase64, 'base64');

        // Validar tamanho do arquivo (máx 50MB)
        if (fileBuffer.length > 50 * 1024 * 1024) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'File too large. Maximum size is 50MB.',
          });
        }

        // Validar tipo de arquivo
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
        const allowedTypes = [...allowedImageTypes, ...allowedAudioTypes];

        if (!allowedTypes.includes(input.contentType)) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid file type. Allowed: JPEG, PNG, WEBP, GIF, MP3, WAV.',
          });
        }

        // Upload para B2
        const url = await uploadToB2(
          fileBuffer,
          input.fileName,
          input.folder,
          input.contentType
        );

        return {
          success: true,
          url,
        };
      } catch (error) {
        console.error('Upload error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to upload file',
        });
      }
    }),

  /**
   * Deletar arquivo do B2 (protegido - requer autenticação)
   */
  delete: protectedProcedure
    .input(deleteSchema)
    .mutation(async ({ input }: { input: z.infer<typeof deleteSchema> }) => {
      try {
        await deleteFromB2(input.fileUrl);
        return {
          success: true,
        };
      } catch (error) {
        console.error('Delete error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete file',
        });
      }
    }),
});

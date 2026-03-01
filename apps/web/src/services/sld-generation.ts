import type { SLDLayout } from '@gridvision/shared';
import { api } from './api';

interface SLDGenerationResponse {
  success: boolean;
  layout: SLDLayout;
  metadata: {
    originalFilename: string;
    fileSize: number;
    mimeType: string;
    generatedAt: string;
    user: string;
  };
}

export async function generateSLD(file: File): Promise<SLDLayout> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<SLDGenerationResponse>('/sld/generate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });

  return response.data.layout;
}

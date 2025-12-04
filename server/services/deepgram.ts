import { createClient, DeepgramClient } from '@deepgram/sdk';
import { DeepgramResponse, StructuredTranscript } from '../types';
import { wordsToChunks, wordsToChunksWithPauses } from '../utils/chunking';
import fs from 'fs';

/**
 * Deepgram Service for transcribing audio/video files
 */
export class DeepgramService {
  private client: DeepgramClient;

  constructor(apiKey?: string) {
    // Initialize the Deepgram client
    // If no API key is provided, it will look for DEEPGRAM_API_KEY in env
    this.client = createClient(apiKey || process.env.DEEPGRAM_API_KEY || '');
  }

  /**
   * Transcribe a local audio/video file and return structured chunks
   *
   * @param filePath - Path to the audio/video file
   * @param options - Transcription options
   * @returns Structured transcript with time-based chunks
   */
  async transcribeFile(
    filePath: string,
    options: {
      chunkDuration?: number;
      useSmartFormat?: boolean;
      model?: string;
      usePauseBasedChunking?: boolean;
    } = {}
  ): Promise<StructuredTranscript> {
    const {
      chunkDuration = 30,
      useSmartFormat = true,
      model = 'nova-3',
      usePauseBasedChunking = false,
    } = options;

    try {
      // Read the audio file
      const audioBuffer = fs.readFileSync(filePath);

      // Configure transcription options
      const transcriptionOptions = {
        model: model,
        smart_format: useSmartFormat,
        punctuate: true,
        diarize: false, // Can be enabled if you need speaker diarization
      };

      console.log('[Deepgram] Sending file to Deepgram API...');
      console.log('[Deepgram] Options:', transcriptionOptions);

      // Send to Deepgram for transcription
      const { result, error } = await this.client.listen.prerecorded.transcribeFile(
        audioBuffer,
        transcriptionOptions
      );

      if (error) {
        throw new Error(`Deepgram API error: ${error.message || JSON.stringify(error)}`);
      }

      if (!result) {
        throw new Error('No result returned from Deepgram');
      }

      console.log('[Deepgram] Transcription successful');

      // Extract words from the response
      const words = this.extractWords(result as any);

      if (words.length === 0) {
        console.warn('[Deepgram] No words found in transcription');
        return {
          transcript: [],
          metadata: {
            duration: 0,
            totalWords: 0,
            totalChunks: 0,
          },
        };
      }

      console.log(`[Deepgram] Extracted ${words.length} words`);
      console.log('[Deepgram] Converting words to chunks...');

      // Convert words to time-based chunks
      const structuredTranscript = usePauseBasedChunking
        ? wordsToChunksWithPauses(words, 2.0, chunkDuration)
        : wordsToChunks(words, chunkDuration);

      console.log(`[Deepgram] Created ${structuredTranscript.transcript.length} chunks`);

      return structuredTranscript;
    } catch (error) {
      console.error('[Deepgram] Error during transcription:', error);
      throw error;
    }
  }

  /**
   * Transcribe audio from a URL
   *
   * @param url - URL to the audio/video file
   * @param options - Transcription options
   * @returns Structured transcript with time-based chunks
   */
  async transcribeUrl(
    url: string,
    options: {
      chunkDuration?: number;
      useSmartFormat?: boolean;
      model?: string;
      usePauseBasedChunking?: boolean;
    } = {}
  ): Promise<StructuredTranscript> {
    const {
      chunkDuration = 30,
      useSmartFormat = true,
      model = 'nova-3',
      usePauseBasedChunking = false,
    } = options;

    try {
      // Configure transcription options
      const transcriptionOptions = {
        model: model,
        smart_format: useSmartFormat,
        punctuate: true,
      };

      console.log('[Deepgram] Sending URL to Deepgram API...');
      console.log('[Deepgram] URL:', url);
      console.log('[Deepgram] Options:', transcriptionOptions);

      // Send to Deepgram for transcription
      const { result, error } = await this.client.listen.prerecorded.transcribeUrl(
        { url },
        transcriptionOptions
      );

      if (error) {
        throw new Error(`Deepgram API error: ${error.message || JSON.stringify(error)}`);
      }

      if (!result) {
        throw new Error('No result returned from Deepgram');
      }

      console.log('[Deepgram] Transcription successful');

      // Extract words from the response
      const words = this.extractWords(result as any);

      if (words.length === 0) {
        console.warn('[Deepgram] No words found in transcription');
        return {
          transcript: [],
          metadata: {
            duration: 0,
            totalWords: 0,
            totalChunks: 0,
          },
        };
      }

      console.log(`[Deepgram] Extracted ${words.length} words`);
      console.log('[Deepgram] Converting words to chunks...');

      // Convert words to time-based chunks
      const structuredTranscript = usePauseBasedChunking
        ? wordsToChunksWithPauses(words, 2.0, chunkDuration)
        : wordsToChunks(words, chunkDuration);

      console.log(`[Deepgram] Created ${structuredTranscript.transcript.length} chunks`);

      return structuredTranscript;
    } catch (error) {
      console.error('[Deepgram] Error during transcription:', error);
      throw error;
    }
  }

  /**
   * Extract words array from Deepgram response
   * Handles the nested structure: results -> channels -> alternatives -> words
   */
  private extractWords(response: DeepgramResponse) {
    try {
      const channels = response?.results?.channels;

      if (!channels || channels.length === 0) {
        return [];
      }

      // Get the first channel
      const firstChannel = channels[0];
      const alternatives = firstChannel?.alternatives;

      if (!alternatives || alternatives.length === 0) {
        return [];
      }

      // Get the first (best) alternative
      const bestAlternative = alternatives[0];
      const words = bestAlternative?.words || [];

      return words;
    } catch (error) {
      console.error('[Deepgram] Error extracting words from response:', error);
      return [];
    }
  }
}

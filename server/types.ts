/**
 * Deepgram API Types
 */

export interface DeepgramWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  punctuated_word?: string;
}

export interface DeepgramAlternative {
  transcript: string;
  confidence: number;
  words: DeepgramWord[];
}

export interface DeepgramChannel {
  alternatives: DeepgramAlternative[];
}

export interface DeepgramResponse {
  results: {
    channels: DeepgramChannel[];
  };
  metadata?: {
    duration?: number;
    [key: string]: any;
  };
}

/**
 * Our Structured Output Types
 */

export interface TranscriptChunk {
  start: number;
  end: number;
  text: string;
}

export interface StructuredTranscript {
  transcript: TranscriptChunk[];
  metadata?: {
    duration: number;
    totalWords: number;
    totalChunks: number;
  };
}

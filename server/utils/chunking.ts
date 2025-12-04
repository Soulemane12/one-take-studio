import { DeepgramWord, TranscriptChunk, StructuredTranscript } from '../types';

/**
 * Converts an array of word-level timestamps from Deepgram into
 * time-based chunks (segments of ~30 seconds).
 *
 * @param words - Array of words with timestamps from Deepgram
 * @param maxChunkDuration - Maximum duration of each chunk in seconds (default: 30)
 * @returns Structured transcript with time-based chunks
 */
export function wordsToChunks(
  words: DeepgramWord[],
  maxChunkDuration: number = 30
): StructuredTranscript {
  const chunks: TranscriptChunk[] = [];

  // Handle empty input
  if (words.length === 0) {
    return {
      transcript: [],
      metadata: {
        duration: 0,
        totalWords: 0,
        totalChunks: 0,
      },
    };
  }

  let currentStart = words[0].start;
  let currentEnd = words[0].end;
  const currentTextWords: string[] = [];

  for (const word of words) {
    // Check if adding this word would exceed the max chunk duration
    if (word.end - currentStart > maxChunkDuration) {
      // Close the current chunk
      chunks.push({
        start: Math.round(currentStart * 100) / 100, // Round to 2 decimals
        end: Math.round(currentEnd * 100) / 100,
        text: currentTextWords.join(' ').trim(),
      });

      // Start a new chunk
      currentStart = word.start;
      currentTextWords.length = 0; // Clear array
    }

    // Use punctuated_word if available (from smart_format), otherwise use word
    currentTextWords.push(word.punctuated_word || word.word);
    currentEnd = word.end;
  }

  // Push the final chunk
  if (currentTextWords.length > 0) {
    chunks.push({
      start: Math.round(currentStart * 100) / 100,
      end: Math.round(currentEnd * 100) / 100,
      text: currentTextWords.join(' ').trim(),
    });
  }

  // Calculate metadata
  const lastWord = words[words.length - 1];
  const duration = lastWord.end;

  return {
    transcript: chunks,
    metadata: {
      duration: Math.round(duration * 100) / 100,
      totalWords: words.length,
      totalChunks: chunks.length,
    },
  };
}

/**
 * Alternative chunking strategy: Break on pauses (silence) between words
 *
 * @param words - Array of words with timestamps from Deepgram
 * @param minPauseDuration - Minimum pause duration to trigger a new chunk (default: 2 seconds)
 * @param maxChunkDuration - Maximum duration before forcing a new chunk (default: 45 seconds)
 * @returns Structured transcript with pause-based chunks
 */
export function wordsToChunksWithPauses(
  words: DeepgramWord[],
  minPauseDuration: number = 2.0,
  maxChunkDuration: number = 45
): StructuredTranscript {
  const chunks: TranscriptChunk[] = [];

  if (words.length === 0) {
    return {
      transcript: [],
      metadata: {
        duration: 0,
        totalWords: 0,
        totalChunks: 0,
      },
    };
  }

  let currentStart = words[0].start;
  let currentEnd = words[0].end;
  const currentTextWords: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const nextWord = words[i + 1];

    // Calculate pause duration to next word
    const pauseDuration = nextWord ? nextWord.start - word.end : 0;

    // Check if we should close the current chunk
    const shouldBreakOnPause = pauseDuration >= minPauseDuration;
    const shouldBreakOnDuration = word.end - currentStart > maxChunkDuration;

    // Add current word to chunk
    currentTextWords.push(word.punctuated_word || word.word);
    currentEnd = word.end;

    // Close chunk if pause is long enough or max duration exceeded
    if (shouldBreakOnPause || shouldBreakOnDuration) {
      chunks.push({
        start: Math.round(currentStart * 100) / 100,
        end: Math.round(currentEnd * 100) / 100,
        text: currentTextWords.join(' ').trim(),
      });

      // Start new chunk if there are more words
      if (nextWord) {
        currentStart = nextWord.start;
        currentTextWords.length = 0;
      }
    }
  }

  // Push final chunk if there are remaining words
  if (currentTextWords.length > 0) {
    chunks.push({
      start: Math.round(currentStart * 100) / 100,
      end: Math.round(currentEnd * 100) / 100,
      text: currentTextWords.join(' ').trim(),
    });
  }

  const lastWord = words[words.length - 1];
  const duration = lastWord.end;

  return {
    transcript: chunks,
    metadata: {
      duration: Math.round(duration * 100) / 100,
      totalWords: words.length,
      totalChunks: chunks.length,
    },
  };
}

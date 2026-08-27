export function chunkArray<T>(array: T[], size: number): T[][] {
  if (size <= 0) {
    throw new RangeError('Chunk size must be greater than 0.')
  }

  const chunkCount = Math.ceil(array.length / size)
  const result: T[][] = Array.from({ length: chunkCount })

  for (let i = 0; i < chunkCount; i++) {
    const start = i * size
    result[i] = array.slice(start, start + size)
  }

  return result
}

#include <stdio.h>
#include <time.h>
#include <stdlib.h>

//width of each line, including newline
const int LINE_WIDTH = 32;

char *readStdIn(size_t *fileLength)
{
   const long CHUNK_SIZE = 102400;
   char *buffer = malloc(0);
   size_t length = 0;
   size_t read = 0;
   do
   {
      buffer = realloc(buffer, length + CHUNK_SIZE);
      read = fread(buffer + length, 1, CHUNK_SIZE, stdin);
      length += read;
   } while (read == CHUNK_SIZE);

   *fileLength = length;
   return buffer;
}

int howManyTrees(char *file, int fileLength, int incX, int incY)
{
   int maxY = fileLength / LINE_WIDTH;
   int x = 0, y = 0;
   int trees = 0;

   while (y < maxY)
   {
      x = x + incX;
      if (x >= LINE_WIDTH - 1)
      {
         x -= (LINE_WIDTH - 1);
      }
      y += incY;

      int pos = x + (y * LINE_WIDTH);

      if (file[pos] == '#')
      {
         trees++;
      }
   }

   return trees;
}

int main(int argc, char *argv[])
{
   float startTime = (float)clock();

   size_t fileLength = 0;
   char *file = readStdIn(&fileLength);

   float readStdinTime = (float)clock();

   int trees = howManyTrees(file, fileLength, 3, 1);

   printf("\nThere are %i trees!\n", trees);

   float endTime = (float)clock();

   float stdinReadDuration = (readStdinTime - startTime) * 1000000 / CLOCKS_PER_SEC;
   float calcDuration = (endTime - readStdinTime) * 1000000 / CLOCKS_PER_SEC;
   printf("Time taken to read stdin: %fμs\n", stdinReadDuration);
   printf("Time taken to calculate: %fμs\n", calcDuration);

   return 0;
}
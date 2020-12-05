#include <stdio.h>
#include <time.h>
#include <stdlib.h>

struct Slope
{
   int x;
   int y;
};

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

int howManyTrees(char *file, int fileLength, int lineWidth, struct Slope slope)
{
   int maxY = fileLength / lineWidth;
   int x = 0, y = 0;
   int trees = 0;

   while (y < maxY)
   {
      x = x + slope.x;
      if (x >= lineWidth - 1)
      {
         x -= (lineWidth - 1);
      }
      y += slope.y;

      int pos = x + (y * lineWidth);

      if (file[pos] == '#')
      {
         trees++;
      }
   }

   return trees;
}

int run(char *file, long fileLength){

   int lineWidth = 0;
   for (int i=0;i<fileLength;i++){
      if (file[i] == '\n'){
         lineWidth = i+1;
         break;
      }
   }

   struct Slope slopes[5] = {{1, 1}, {3, 1}, {5, 1}, {7, 1}, {1, 2}};

   int multiTrees = 1;
   for (int i = 0; i < 5; i++)
   {
      multiTrees = multiTrees * howManyTrees(file, fileLength, lineWidth, slopes[i]);
   }

   return multiTrees;
}

int main()
{
   int runs = 1000000;

   clock_t startTime = startTime = clock();

   long fileLength = 0;
   char *file = readStdIn(&fileLength);

   clock_t readStdinTime = clock();

   for(int i=0;i<runs;i++){
      run(file,fileLength);
   }
   
   clock_t endTime = clock();

   printf("stdin read time: %liμs\n", readStdinTime - startTime);
   printf("total execution time: %liμs\n", endTime - readStdinTime);
   printf("execution time per run: %fμs\n", (float)(endTime-readStdinTime)/(float)runs);

   free(file);
   return 0;
}
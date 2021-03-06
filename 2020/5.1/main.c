#include <stdio.h>
#include <time.h>
#include <stdlib.h>
#include "../../utils.h"

int i, j, seatNumber, maxSeatNumber;
u_char col, row;

int run(char *file, long fileLength)
{
   maxSeatNumber = 0;

   while (i < fileLength)
   {
      col = row = 0;
      for (j = 64; j > 0; j >>= 1)
      {
         if (file[i++] == 'B')
            row |= j;
      }

      for (j = 4; j > 0; j >>= 1)
      {
         if (file[i++] == 'R')
            col |= j;
      }

      seatNumber = (row*8) + col;
      if (seatNumber > maxSeatNumber)
         maxSeatNumber = seatNumber;

      i++;
   }

   return maxSeatNumber;
}  

int main()
{
   long fileLength;
   char *file;
   int result, i, runs;
   clock_t startReadStdIn, endReadStdIn, startSingleRun, endSingleRun, startPound, endPound;

   startReadStdIn = clock();
   fileLength = 0;
   file = readStdIn(&fileLength);
   endReadStdIn = clock();

   startSingleRun = clock();
   result = run(file, fileLength);
   endSingleRun = clock();

   printf("result: %i\n\n", result);

   runs = 1000000;
   printf("pounding...");
   fflush(stdout);

   startPound = clock();
   for (i = 0; i < runs; i++)
   {
      run(file, fileLength);
   }

   endPound = clock();

   printf("%c", 0xd);
   printf("stdin read time: %liμs\n", endReadStdIn - startReadStdIn);
   printf("single run time: %liμs\n", endSingleRun - startSingleRun);
   printf("total pounding time (%i runs): %liμs\n", runs, endPound - startPound);
   printf("average time per run: %fμs\n", (float)(endPound - startPound) / (float)runs);

   free(file);
   return 0;
}
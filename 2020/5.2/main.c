#include <stdio.h>
#include <time.h>
#include <stdlib.h>
#include "../../utils.h"

void findSeats(char* file, long fileLength, int* maxSeatNumber, int* mySeatNumber)
{
   u_char seats[1024] = {0};
   int i = 0, j = 512, seatNumber = 0, max = 0, my = 0;

   while (i < fileLength)
   {
      if (file[i] == 'B' || file[i] == 'R')
         seatNumber |= j;

      j >>= 1;
      i++;
      if ((i+1)%11 == 0){
         if (seatNumber > max)
            max = seatNumber;
         
         seats[seatNumber] = 1;
         seatNumber = 0;
         j = 512;
         i++;
      }
   }

   my = 0;
   for (i = 9; my == 0 && i < 1014; i++)
      if (!seats[i] && seats[i - 1] && seats[i + 1])
         my = i;

   *maxSeatNumber = max;
   *mySeatNumber = my;
}

int main()
{
   long fileLength;
   char *file;
   int maxSeatNumber, mySeatNumber;
   int i, runs;
   clock_t startReadStdIn, endReadStdIn, startCalc, endCalc;

   startReadStdIn = clock();
   fileLength = 0;
   file = readStdIn(&fileLength);
   endReadStdIn = clock();

   startCalc = clock();
   findSeats(file, fileLength, &maxSeatNumber, &mySeatNumber);
   endCalc = clock();

   printf("maxSeatNumber=%i\nmySeatNumber=%i\n\n", maxSeatNumber, mySeatNumber);

   printf("stdin read time: %liμs\n", endReadStdIn - startReadStdIn);
   printf("calc time: %liμs\n", endCalc - startCalc);

   free(file);
   return 0;
}
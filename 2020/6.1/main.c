#include <stdio.h>
#include <time.h>
#include <stdlib.h>
#include <stdint.h>
#include "../../utils.h"

void countAnswers(char *file, long fileLength, int *answerCount)
{
   int i = 0, j = 0;
   u_int32_t lettersFound = 0;
   u_int32_t letterValues[] = {1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432};

   while (i < fileLength)
   {
      j = file[i] - 'a';
      if (!(lettersFound & letterValues[j]))
      {
         (*answerCount)++;
         lettersFound |= letterValues[j];
      }

      if (++i == fileLength || (file[i] == '\n' && file[++i] == '\n'))
      {
         lettersFound = 0;
         i++;
      }
   }
}

int main()
{
   long fileLength;
   char *file;
   int answerCount = 0;
   int i, runs;
   clock_t startReadStdIn, endReadStdIn, startCalc, endCalc;

   startReadStdIn = clock();
   fileLength = 0;
   file = readStdIn(&fileLength);
   endReadStdIn = clock();

   startCalc = clock();
   countAnswers(file, fileLength, &answerCount);
   endCalc = clock();

   printf("answerCount=%i\n\n", answerCount);

   printf("stdin read time: %liμs\n", endReadStdIn - startReadStdIn);
   printf("calc time: %liμs\n", endCalc - startCalc);

   free(file);
   return 0;
}
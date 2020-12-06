#include <stdio.h>
#include <time.h>
#include <stdlib.h>
#include <stdint.h>
#include "../../utils.h"

void countAnswers(char *file, long fileLength, int *answerCount)
{
   int i = 0, j = 0, groupSize = 0;
   u_int32_t letterValues[] = {1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432};
   u_int32_t groupMembers[1024] = {0};

   while (i < fileLength)
   {
      groupMembers[groupSize] |= letterValues[file[i] - 'a']; //store a bit for the letter

      if (++i == fileLength || (file[i] == '\n')) //EOF or \n means end of member
      {
         groupMembers[++groupSize] = 0; //move to and initialise the next member

         if (i == fileLength || file[++i] == '\n') //EOF or another \n means end of group
         {
            //combine all the members' bits
            for (j = 1; j < groupSize; j++)
            {
               groupMembers[0] &= groupMembers[j];
            }
            //check for bit-letters that are present
            for (j = 0; j < 26; j++)
            {
               if (groupMembers[0] & letterValues[j]){
                  (*answerCount)++;
               }
            }
            //reinitialise the group
            groupSize = 0;
            groupMembers[0] = 0;
            //move to next char
            i++;
         }
      }
   }
}

void _countAnswers(char *file, long fileLength, int *answerCount)
{
   int i = 0, j = 0;
   int lettersFound[26] = {0};
   int groupSize = 0;

   while (i < fileLength)
   {
      j = file[i] - 'a';

      lettersFound[j]++;

      if (++i == fileLength || (file[i] == '\n'))
      {
         groupSize++;
         if (i == fileLength || file[++i] == '\n')
         {
            for (j = 0; j < 26; j++)
            {
               // printf("%c=%i ", j+97, lettersFound[j]);
               if (lettersFound[j] == groupSize)
                  (*answerCount)++;
               lettersFound[j] = 0;
            }
            // printf("groupSize=%i\n", groupSize);
            groupSize = 0;
            i++;
         }
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
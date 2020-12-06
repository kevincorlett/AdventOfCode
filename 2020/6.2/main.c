#include <stdio.h>
#include <time.h>
#include <stdlib.h>
#include <stdint.h>
#include "../../utils.h"

int countAnswers(char* file, long fileLength)
{
   const u_int32_t letterBits[] = {1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 33554432};
   const u_int32_t bits_26 = 67108863; //26 LSBs set high

   int i = 0; //the current char index
   int n = 0; //this will be returned
   
   u_int32_t groupAnswers = bits_26; //set all high because they'll be and-ed
   
   u_int32_t memberAnswers = 0; //set all low because they'll be or-ed

   while (i < fileLength)
   {
      memberAnswers |= letterBits[file[i] - 'a']; //set the bit that corresponds to the current char

      if (++i == fileLength || (file[i] == '\n')) //end of member
      {
         groupAnswers &= memberAnswers;  //combine the member's answers into the group answers
         
         memberAnswers = 0;  //reset the member answers
         if (i == fileLength || file[++i] == '\n') //end of group
         {
            while (groupAnswers > 0)  //check for bit-letters that are present
            {
               if (groupAnswers & 1)
                  n++;

               groupAnswers >>= 1;
            }
            
            groupAnswers = bits_26;  //reset the group answers
            
            i++; //move to next char
         }
      }
   }
   return n;
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
   answerCount = countAnswers(file, fileLength);
   endCalc = clock();

   printf("answerCount=%i\n\n", answerCount);

   printf("stdin read time: %liμs\n", endReadStdIn - startReadStdIn);
   printf("calc time: %liμs\n", endCalc - startCalc);

   free(file);
   return 0;
}
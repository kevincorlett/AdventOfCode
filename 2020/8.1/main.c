#include <stdio.h>
#include <time.h>
#include <stdlib.h>
#include <stdint.h>
#include "../../utils.h"

#define debug
struct Number
{
   int sign;
   int value;
   int abs;
};

struct Number readNumber(char *file, long fileLength, int *i)
{
   struct Number n = {0, 0, 0};
   int j = *i;
   n.sign = file[j] == '-' ? -1 : 1;
   while (++j < fileLength && file[j] >= '0' && file[j] <= '9')
   {
      n.abs *= 10;
      n.abs += file[j] - '0';
   }
   if (n.sign == -1)
      n.value = -n.abs;
   else
      n.value = n.abs;

   *i = j;

   return n;
}

int process(char *file, long fileLength)
{
   struct Number n = {0, 0, 0};

   int i = 0, j = 0, result = 0;
   while (i < fileLength && file[i] != 0)
   {
#ifdef debug
      printf("%i\t%i\t", result, i);
#endif

      char startChar = file[i];
      file[i] = 0; //mark that we've been here before
      
      //noop
      if (startChar == 'n')
      {
         i = findNextChar(file, fileLength, i, '\n') + 1;
#ifdef debug
         printf("nop\t");
#endif
      }

      //increment
      else if (startChar == 'a')
      {
         i += 4;
         n = readNumber(file, fileLength, &i);

         result += n.value;
         i++;
#ifdef debug
         printf("acc %i\t", n.value);
#endif
      }

      //jump
      else if (startChar == 'j')
      {
         i += 4;
         n = readNumber(file, fileLength, &i);

         for (j = 0; j < n.abs; j++)
         {
            if (n.sign > 0)
               i = findNextChar(file, fileLength, i + 1, '\n');
            else
               i = findPrevChar(file, fileLength, i - 1, '\n');
         }
         //we're at the \n following the instruction we want - move to the start
         i = findPrevChar(file, fileLength, i - 1, '\n') + 1;

#ifdef debug
         printf("jmp %i\t", n.value);
#endif
      }

#ifdef debug
      printf("\t%i\n", i);
#endif
   }

   return result;
}

int main()
{
   long fileLength;
   char *file;
   int result = 0;
   int i, runs;
   clock_t startReadStdIn, endReadStdIn, startCalc, endCalc;

   startReadStdIn = clock();
   fileLength = 0;
   file = readStdIn(&fileLength);
   endReadStdIn = clock();

   startCalc = clock();
   result = process(file, fileLength);
   endCalc = clock();

   printf("result=%i\n\n", result);

   printf("stdin read time: %liμs\n", endReadStdIn - startReadStdIn);
   printf("calc time: %liμs\n", endCalc - startCalc);

   free(file);
   return 0;
}
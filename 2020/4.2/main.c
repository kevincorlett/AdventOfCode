#include <stdio.h>
#include <time.h>
#include <stdlib.h>
#include "../../utils.h"

struct Span
{
   int start;
   int end;
};

struct Entry
{
   struct Span byr;
   struct Span iyr;
   struct Span eyr;
   struct Span hgt;
   struct Span hcl;
   struct Span ecl;
   struct Span pid;
   struct Span cid;
};

int validateByr(char *file, struct Span span)
{
   int value = parseInt(file, span.start, span.end);
   return value > 1919 && value < 2003;
}
int validateIyr(char *file, struct Span span)
{
   int value = parseInt(file, span.start, span.end);
   return value > 2009 && value < 2021;
}
int validateEyr(char *file, struct Span span)
{
   int value = parseInt(file, span.start, span.end);
   return value > 2019 && value < 2031;
}
int validateHgt(char *file, struct Span span)
{
   int value = parseInt(file, span.start, span.end - 2);

   if (compareStr(file, "cm", span.end - 1, 0, 2))
      return value > 149 && value < 194;

   if (compareStr(file, "in", span.end - 1, 0, 2))
      return value > 58 && value < 77;

   return 0;
}
int validateHcl(char *file, struct Span span)
{
   if (file[span.start] != '#' || span.end - span.start != 6)
      return 0;

   for (int i = span.start + 1; i <= span.end; i++)
   {
      if (!(file[i] < '0' && file[i] > '9') || !(file[i] < 'a' && file[i] > 'f'))
         return 1;
   }

   return 0;
}
int validateEcl(char *file, struct Span span)
{
   char *colours[7] = {"amb", "blu", "brn", "gry", "grn", "hzl", "oth"};
   for (int i = 0; i < 7; i++)
   {
      if (compareStr(file, colours[i], span.start, 0, 3))
         return 1;
   }
   return 0;
}
int validatePid(char *file, struct Span span)
{
   if (span.end - span.start != 8)
      return 0;

   for (int i = span.start; i <= span.end; i++)
   {
      if (file[i] < '0' || file[i] > '9')
         return 0;
   }
   return 1;
}
int validateCid(char *file, struct Span span)
{
   return 1;
}
int validateEntry(char *file, struct Entry entry)
{
   return validateByr(file, entry.byr) &&
          validateIyr(file, entry.iyr) &&
          validateEyr(file, entry.eyr) &&
          validateHgt(file, entry.hgt) &&
          validateHcl(file, entry.hcl) &&
          validateEcl(file, entry.ecl) &&
          validatePid(file, entry.pid) &&
          validateCid(file, entry.cid);
};

int run(char *file, long fileLength)
{
   int i = 0;
   int validEntries = 0;
   while (i < fileLength)
   {
      struct Entry entry;
      int nextBlank = findNextBlank(file, fileLength, i + 4);
      struct Span value = {i + 4, nextBlank - 1};

      if (compareStr(file, "byr", i, 0, 3))
         entry.byr = value;
      else if (compareStr(file, "iyr", i, 0, 3))
         entry.iyr = value;
      else if (compareStr(file, "eyr", i, 0, 3))
         entry.eyr = value;
      else if (compareStr(file, "hgt", i, 0, 3))
         entry.hgt = value;
      else if (compareStr(file, "hcl", i, 0, 3))
         entry.hcl = value;
      else if (compareStr(file, "ecl", i, 0, 3))
         entry.ecl = value;
      else if (compareStr(file, "pid", i, 0, 3))
         entry.pid = value;
      else if (compareStr(file, "cid", i, 0, 3))
         entry.cid = value;

      i = nextBlank + 1;
      if (nextBlank == fileLength || (file[nextBlank] == '\n' && file[i] == '\n' && validateEntry(file, entry)))
      {
         validEntries++;
         i++;
      }
   }

   return validEntries;
}

int main()
{

   clock_t startReadStdin = clock();

   long fileLength = 0;
   char *file = readStdIn(&fileLength);

   clock_t endReadStdIn = clock();

   clock_t startSingleRun = clock();

   int result = run(file, fileLength);

   clock_t endSingleRun = clock();
   printf("result: %i\n\n", result);



   int runs = 100000;
   printf("pounding...");
   fflush(stdout);

   clock_t startPound = clock();
   for (int i = 0; i < runs; i++)
   {
      run(file, fileLength);
   }

   clock_t endPound = clock();

   printf("%c",0xd);
   printf("stdin read time: %liμs\n", endReadStdIn - startReadStdin);
   printf("single run time: %liμs\n", endSingleRun - startSingleRun);
   printf("total pounding time (%i runs): %liμs\n", runs, endPound - startPound);
   printf("average time per run: %fμs\n", (float)(endPound - startPound) / (float)runs);

   free(file);
   return 0;
}
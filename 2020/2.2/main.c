#include <stdio.h>
#include <time.h>
#include <stdlib.h>

char *readFile(char *fileName)
{
   char *buffer = 0;
   long length;
   FILE *f = fopen(fileName, "rb");

   if (f)
   {
      fseek(f, 0, SEEK_END);
      length = ftell(f);
      fseek(f, 0, SEEK_SET);
      buffer = malloc(length);
      if (buffer)
      {
         fread(buffer, 1, length, f);
      }
      fclose(f);
   }

   return buffer;
}

int main()
{
   char *file = readFile("./input.txt");
   float startTime, endTime;

   
   startTime = (float)clock() / CLOCKS_PER_SEC;

   int matchingPasswords = 0;
   int stage = 0; //0 = pos1, 1=pos2, 2=char, 3=pwd
   int pos1 = 0;
   int pos2 = 0;
   int chr = 0;
   int pwd[1000];
   int pwdIdx = 0;

   int i=0;
   do
   {
      char x = file[i++];
      if (x == 0){
         break;
      }

      //reading the first position
      if (stage == 0)
      {
         if (x == 0x2D)
         {
            stage = 1;
         }
         else
         {
            pos1 = (pos1 * 10) + x - 0x30;
         }
         continue;
      }

      //reading the second position
      if (stage == 1)
      {
         if (x == 0x20)
         {
            stage = 2;
         }
         else
         {
            pos2 = (pos2 * 10) + x - 0x30;
         }
         continue;
      }

      //reading the char
      if (stage == 2)
      {

         chr = x;

         //discard the next 2 bytes
         i += 2;

         stage = 3;
         continue;
      }

      //reading the password
      if (stage == 3)
      {
         if (x == 0x0A)
         {
            //eol - validate the password
            if (pwd[pos1 - 1] == chr ? pwd[pos2 - 1] != chr : pwd[pos2 - 1] == chr)
            {
               matchingPasswords++;
            }

            //reset
            pos1 = 0;
            pos2 = 0;
            chr = 0;
            pwdIdx = 0;
            stage = 0;
            continue;
         }

         pwd[pwdIdx++] = x;
         continue;
      }
   } while (1);

   printf("There are %i matching passwords\n", matchingPasswords);

   endTime = (float)clock() / CLOCKS_PER_SEC;

   float timeElapsed = (endTime - startTime) * 1000;
   printf("Time taken %fms\n", timeElapsed);

   return 0;
}

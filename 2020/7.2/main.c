#include <stdio.h>
#include <time.h>
#include <stdlib.h>
#include <stdint.h>
#include "../../utils.h"

struct Colour
{
   u_int64_t part1;
   u_int64_t part2;
};

int coloursEqual(struct Colour colour1, struct Colour colour2)
{
   return colour1.part1 == colour2.part1 && colour1.part2 == colour2.part2;
}

struct BagsInside
{
   int quantity;
   struct Colour colour;
   struct Bag *bag;
};

struct Bag
{
   struct Colour colour;
   struct BagsInside children[10]; //max 10 children per bag should be enough
   int bagsInsideLength;
   int hasGold;
   int totalBagsInside;
};

//Reads a lower word and translates it into a number where 5 bits are allocated
//per letter, with each letter's value relative to the lowestChar (so if lowestChar='a', then a=0, b=1 and so on).
//Stops at the first invalid character found.
//Moves the index i to the index of the first char after the invalid char
u_int64_t readWord(char *file, int fileLength, int *i, char lowestChar, char highestChar)
{
   u_int64_t c = 0;
   int j = *i;
   while (file[j] >= lowestChar && file[j] <= highestChar)
   {
      c <<= 5;
      c |= file[j++] - lowestChar;
   }
   *i = j + 1;
   return c;
}

struct BagsInside readBagInside(char *file, int fileLength, int *i)
{
   int j = *i;

   //get number of bags
   struct BagsInside result;
   result.quantity = 0;
   while (file[j] != ' ')
   {
      result.quantity *= 10;
      result.quantity += file[j++] - '0';
   }
   j++;
   if (result.quantity != 0)
   {
      result.colour.part1 = readWord(file, fileLength, &j, 'a', 'z');
      result.colour.part2 = readWord(file, fileLength, &j, 'a', 'z');
   }

   //skip bag[s]
   j = findNextBlank(file, fileLength, j);
   if (file[j] == ' ')
      j++;

   *i = j;
   return result;
}

int hasGold(struct Bag *bag)
{
   int i;

   if (bag->hasGold > -1)
      return bag->hasGold;

   bag->hasGold = (bag->colour.part1 == 19112376 && bag->colour.part2 == 211299); //shiny gold
   if (bag->hasGold)
      return 1;

   for (i = 0; i < bag->bagsInsideLength; i++)
   {
      if (bag->hasGold = hasGold(bag->children[i].bag))
         break;
   }
   return bag->hasGold;
}

int countBagsInside(struct Bag *bag)
{
   if (bag->totalBagsInside > -1)
      return bag->totalBagsInside;

   int total = 0;
   for (int i = 0; i < bag->bagsInsideLength; i++)
   {
      total += bag->children[i].quantity * (1 + countBagsInside(bag->children[i].bag));
   }
   return bag->totalBagsInside = total;
}

void process(char *file, int fileLength, int *bagsContainingGold, int *bagsInsideGold)
{
   struct Bag bags[600];
   struct Bag *goldBag;

   //first pass - parse the bags
   int i = 0, j = 0, k = 0, bagCount = 0, bagsWithGold = 0;
   struct Bag b;
   while (i < fileLength)
   {
      b.hasGold = -1;         //-1 means we don't know yet
      b.totalBagsInside = -1; //-1 means we don't know yet
      b.colour.part1 = readWord(file, fileLength, &i, 'a', 'z');
      b.colour.part2 = readWord(file, fileLength, &i, 'a', 'z');
      b.bagsInsideLength = 0;

      //discard the next two words
      i = findNextChar(file, fileLength, i + 1, ' ');
      i = findNextChar(file, fileLength, i + 1, ' ');
      i++;

      if (file[i] == 'n')
      {
         //handle 'no other bags'
         i = findNextChar(file, fileLength, i, '\n') + 1;
      }
      else
      {
         //iterate through the contained bags
         while (i < fileLength && file[i] != '\n')
         {
            b.children[b.bagsInsideLength++] = readBagInside(file, fileLength, &i);
         }
         i++;
      }
      bags[bagCount++] = b;
      if (b.colour.part1 == 19112376 && b.colour.part2 == 211299)
         goldBag = &bags[bagCount - 1];
   }

   //2nd pass - link the bags
   for (i = 0; i < bagCount; i++)
   {
      for (j = 0; j < bags[i].bagsInsideLength; j++)
      {
         u_int64_t c1 = bags[i].children[j].colour.part1;
         u_int64_t c2 = bags[i].children[j].colour.part2;
         for (k = 0; k < bagCount; k++)
         {
            if (bags[k].colour.part1 == c1 && bags[k].colour.part2 == c2)
            {
               bags[i].children[j].bag = &bags[k];
               break;
            }
         }
      }
   }

   //3rd pass - dig for gold!
   bagsWithGold = 0;
   for (i = 0; i < bagCount; i++)
   {
      if (hasGold(&bags[i]))
         bagsWithGold++;
   }
   //subtract 1 for the gold bag itself
   *bagsContainingGold = bagsWithGold - 1;

   //4th pass - count the bags inside the shiny gold one
   *bagsInsideGold = countBagsInside(goldBag);
}

int main()
{
   long fileLength;
   char *file;
   int answerCount = 0;
   int i, runs;
   clock_t startReadStdIn, endReadStdIn, startCalc, endCalc;
   int bagsContainingGold, bagsInsideGold;

   startReadStdIn = clock();
   fileLength = 0;
   file = readStdIn(&fileLength);
   endReadStdIn = clock();

   startCalc = clock();
   process(file, fileLength, &bagsContainingGold, &bagsInsideGold);
   endCalc = clock();

   printf("\nbagsContainingGold=%i\n", bagsContainingGold);
   printf("bagsInsideGold=%i\n\n", bagsInsideGold);

   printf("stdin read time: %liμs\n", endReadStdIn - startReadStdIn);
   printf("calc time: %liμs\n", endCalc - startCalc);

   free(file);
   return 0;
}
#include <stdio.h>
#include <time.h>
#include <stdlib.h>
#include <stdint.h>
#include <gmp.h>
#include "../../utils.h"

int MAX_ROUND = 20;

struct Operation
{
   char op;
   u_int64_t right;
};

struct Test
{
   u_int64_t divisibleBy;
   int ifTrueThrowTo;
   int ifFalseThrowTo;
};

struct Monkey
{
   int id;
   int total;
   int itemCount;

   u_int64_t items[100]; // 100 ought to do it

   struct Operation operation;
   struct Test test;
};

void parseFile(char *file, int fileLength, struct Monkey monkeys[], int *monkeyCount)
{

   int i, j, k;
   int spacePos, colonPos, newlinePos, commaPos, equalPos;

   while (j < fileLength)
   {
      // first line is 'Monkey x:'
      j = findNextBlank(file, fileLength, j);
      
      monkeys[i].id = parseInt2(file, fileLength, j + 1);
      j = findNextBlank(file, fileLength, j+1) + 1;

      // 2nd line is '  Starting items: aa, bb, cc'
      j = findNextChar(file, fileLength, j, ':');
      newlinePos = findNextChar(file, fileLength, j, '\n');
      k = 0;
      do
      {
         monkeys[i].items[k++] = parseInt2(file, fileLength, j + 2);
         monkeys[i].itemCount++;
      } while ((j = findNextChar(file, fileLength, j + 1, ',')) < newlinePos);

      // 3rd line is '  Operation: new = old [+-*/] (old|\d+)'
      j = findNextChar(file, fileLength, newlinePos, '=');
      monkeys[i].operation.op = file[j + 6];
      monkeys[i].operation.right = parseInt2(file, fileLength, j + 8);

      // 4th line is '  Test: divisible by nn'
      colonPos = findNextChar(file, fileLength, j, ':');
      monkeys[i].test.divisibleBy = parseInt2(file, fileLength, colonPos + 15);
      j = colonPos + 15;

      // 5th line is '    If true: throw to monkey a'
      j = findNextChar(file, fileLength, j, 'y');
      monkeys[i].test.ifTrueThrowTo = parseInt2(file, fileLength, j + 2);

      // 6th line is '    If false: throw to monkey b'
      j = findNextChar(file, fileLength, j + 1, 'y');
      monkeys[i].test.ifFalseThrowTo = parseInt2(file, fileLength, j + 2);

      i++;
      j = findNextChar(file, fileLength, j + 2, '\n') + 2;
   }

   *monkeyCount = i;
}

void printMonkeys(struct Monkey monkeys[], int monkeyCount)
{
   for (int i = 0; i < monkeyCount; i++)
   {

      printf("Monkey %i:\n", monkeys[i].id);
      printf("  [total: %i]\n", monkeys[i].total);
      printf("  Items:");

      for (int j = 0; j < monkeys[i].itemCount; j++)
      {
         printf(" %llu", monkeys[i].items[j]);
         if (j < monkeys[i].itemCount - 1)
            printf(",");
      }
      printf("\n");

      if (monkeys[i].operation.right == 0){
         printf("  Operation: new = old %c old\n", monkeys[i].operation.op);
      } else {
         printf("  Operation: new = old %c %llu\n", monkeys[i].operation.op, monkeys[i].operation.right);
      }
      printf("  Test: if divisible by %llu\n", monkeys[i].test.divisibleBy);
      printf("    If true: throw to monkey %i\n", monkeys[i].test.ifTrueThrowTo);
      printf("    If false: throw to monkey %i\n", monkeys[i].test.ifFalseThrowTo);
   }
}

u_int64_t processOperation(u_int64_t oldValue, struct Operation operation){
   
   switch (operation.op){
      case '+':
         if (operation.right == 0) return oldValue + oldValue;
         return oldValue + operation.right;
      case '-':
         if (operation.right == 0) return oldValue - oldValue;
         return oldValue - operation.right;
      case '*':
         if (operation.right == 0) return oldValue * oldValue;
         return oldValue * operation.right;
      case '/':
         if (operation.right == 0) return oldValue / oldValue;
         return oldValue / operation.right;
   }

   return 0;
}

long process(char *file, int fileLength)
{
   struct Monkey monkeys[100];
   int monkeyCount;
   parseFile(file, fileLength, monkeys, &monkeyCount);

   printMonkeys(monkeys, monkeyCount);

   for (int i=0;i<MAX_ROUND;i++){
      for (int j=0;j<monkeyCount;j++){
         monkeys[j].total += monkeys[j].itemCount;
         while (monkeys[j].itemCount > 0){
            u_int64_t currentItem = monkeys[j].items[--monkeys[j].itemCount];

            u_int64_t newValue = processOperation(currentItem, monkeys[j].operation);
            
            // newValue = newValue / 3;

            int throwTo;
            if (newValue % monkeys[j].test.divisibleBy == 0){
               throwTo = monkeys[j].test.ifTrueThrowTo;
            } else {
               throwTo = monkeys[j].test.ifFalseThrowTo;
            }
            monkeys[throwTo].items[monkeys[throwTo].itemCount++] = newValue;
         }
      }
   }
   printf("\n\n");
   printMonkeys(monkeys, monkeyCount);
   long max1, max2;
   for (int i=0;i<monkeyCount;i++){
      if (monkeys[i].total > max1){
         max2 = max1;
         max1 = monkeys[i].total;
         continue;
      }
      if (monkeys[i].total > max2){
         max2 = monkeys[i].total;
      }
   }
printf("%li %li\n", max1, max2);
   return max1 * max2;
}

int main()
{
   size_t fileLength;
   char *file;
   int answerCount = 0;
   int i, runs;
   clock_t startReadStdIn, endReadStdIn, startCalc, endCalc;
   int bagsContainingGold, bagsInsideGold;
   u_int64_t result;

   startReadStdIn = clock();
   fileLength = 0;
   file = readStdIn(&fileLength);
   endReadStdIn = clock();

   startCalc = clock();
   result = process(file, fileLength);
   endCalc = clock();

   printf("\nresult=%llu\n", result);

   printf("stdin read time: %liμs\n", endReadStdIn - startReadStdIn);
   printf("calc time: %liμs\n", endCalc - startCalc);

   free(file);
   return 0;
}
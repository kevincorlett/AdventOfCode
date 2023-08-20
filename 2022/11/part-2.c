#include <stdio.h>
#include <time.h>
#include <stdlib.h>
#include <stdint.h>
#include <gmp.h>
#include "../../utils.h"

int MAX_ROUND = 10000;

struct Operation
{
   char op;
   mpz_t right;
};

struct Test
{
   mpz_t divisibleBy;
   int ifTrueThrowTo;
   int ifFalseThrowTo;
};

struct Monkey
{
   int id;
   int total;
   int itemCount;

   mpz_t items[100]; // 100 ought to do it

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
         mpz_init_set_si(monkeys[i].items[k++], parseInt2(file, fileLength, j + 2));
         monkeys[i].itemCount++;
      } while ((j = findNextChar(file, fileLength, j + 1, ',')) < newlinePos);

      // 3rd line is '  Operation: new = old [+-*/] (old|\d+)'
      j = findNextChar(file, fileLength, newlinePos, '=');
      monkeys[i].operation.op = file[j + 6];
      mpz_init_set_si(monkeys[i].operation.right, parseInt2(file, fileLength, j + 8));

      // 4th line is '  Test: divisible by nn'
      colonPos = findNextChar(file, fileLength, j, ':');
      mpz_init_set_si(monkeys[i].test.divisibleBy, parseInt2(file, fileLength, colonPos + 15));
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
         gmp_printf(" %Zd", monkeys[i].items[j]);
         if (j < monkeys[i].itemCount - 1)
            printf(",");
      }
      printf("\n");

      if (mpz_cmp_si(monkeys[i].operation.right, 0) == 0){
         printf("  Operation: new = old %c old\n", monkeys[i].operation.op);
      } else {
         gmp_printf("  Operation: new = old %c %Zd\n", monkeys[i].operation.op, monkeys[i].operation.right);
      }
      gmp_printf("  Test: if divisible by %Zd\n", monkeys[i].test.divisibleBy);
      printf("    If true: throw to monkey %i\n", monkeys[i].test.ifTrueThrowTo);
      printf("    If false: throw to monkey %i\n", monkeys[i].test.ifFalseThrowTo);
   }
}

void processOperation(mpz_t result, mpz_t left, struct Operation operation){

   mpz_t right;
   mpz_init_set_si(result,0);

   if (mpz_cmp_si(operation.right, 0) == 0) {
      mpz_init_set(right, left);
   } else {
      mpz_init_set(right, operation.right);
   }
   
   switch (operation.op){
      case '+':
         mpz_add(result, left, right);
         break;
      case '-':
         mpz_sub(result, left, right);
         break;
      case '*':
         mpz_mul(result, left, right);
         break;
      case '/':
         mpz_div(result, left, right);
         break;
   }

}

long process(char *file, int fileLength)
{
   struct Monkey monkeys[100];
   int monkeyCount;
   parseFile(file, fileLength, monkeys, &monkeyCount);

   printMonkeys(monkeys, monkeyCount);

   //had to look it up in the end.  dang it!  https://www.youtube.com/watch?v=-cdn3QkR224
   //multiply all the divisors together to get the modulus
   mpz_t modulus;
   mpz_init_set_si(modulus,1);
   for(int i=0;i<monkeyCount;i++){
      mpz_mul(modulus, modulus, monkeys[i].test.divisibleBy);
   }

   gmp_printf("Modulus=%Zd\n", modulus);


   for (int i=0;i<MAX_ROUND;i++){
      for (int j=0;j<monkeyCount;j++){
         monkeys[j].total += monkeys[j].itemCount;
         while (monkeys[j].itemCount > 0){
            
            mpz_t newValue;

            processOperation(newValue, monkeys[j].items[--monkeys[j].itemCount], monkeys[j].operation);
            // newValue = newValue / 3;

            int throwTo;
            mpz_t remainder;
            mpz_init(remainder);
            mpz_tdiv_r(remainder, newValue, monkeys[j].test.divisibleBy);
           
            if (mpz_cmp_si(remainder, 0) == 0) {
               throwTo = monkeys[j].test.ifTrueThrowTo;
            } else {
               throwTo = monkeys[j].test.ifFalseThrowTo;
            }
            mpz_tdiv_r(newValue, newValue, modulus);
            mpz_init_set(monkeys[throwTo].items[monkeys[throwTo].itemCount++], newValue);
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
   long result;

   startReadStdIn = clock();
   fileLength = 0;
   file = readStdIn(&fileLength);
   endReadStdIn = clock();

   startCalc = clock();
   result = process(file, fileLength);
   
   endCalc = clock();

   printf("\nresult=%ld\n", result);

   printf("stdin read time: %liμs\n", endReadStdIn - startReadStdIn);
   printf("calc time: %liμs\n", endCalc - startCalc);

   free(file);
   return 0;
}
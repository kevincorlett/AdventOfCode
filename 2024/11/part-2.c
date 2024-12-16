#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <pthread.h>
#include <assert.h>
#include "../../utils.h"

// #include <time.h>
// #include <stdint.h>
// #include <gmp.h>


int numberOfBlinks = 25;
int maxThreads=16;
int threadCount=0;

void printStone(long stone[]){
    printf("%li.", stone[0]);
    for (int i=1;i<=stone[0];i++){
        printf("%li", stone[i]);
    }
    printf("\n");
}

void printStone2(long stone[]){
    printf("[\033[32m%li\033[0m", stone[0]);
    for (int i=1;i<=stone[0]; i++){
        printf(",%li", stone[i]);
    }
    printf("]");
}

//finds the numerical value of the array
long getValue(long num[]){
    long val = 0;
    long mul = 1;
    for (int i=1; i<=num[0]; i++){
        val += (mul*num[i]);
        mul = mul*10;
    }
    return val;
}

//inspects the value of num[i].  if it is >9, then the units
//are kept and the rest is moved to the next index in num[]
//the function keeps moving through num[], ensuring that all elements
//have a value <10
void spread(long num[], int i){
    if (num[i] > 9){
        long x = num[i] % 10;
        long y = num[i] / 10;
        
        num[i] = x;
        if (num[0] >= i+1){
            num[i+1] += y;
        } else {
            num[i+1] = y;
            num[0] = i+1;
        }
    
        if (num[i+1] > 9){
            spread(num, i+1);
        }
    }
}

//multiply an array-stored number, return a new array
long* multiply(long stone[], long mul){
    long stoneCopy[100];
    memcpy(stoneCopy, stone, (stone[0] + 1) * sizeof(long));

    int stoneLength = stoneCopy[0];
    int newStoneLength = stone[0] = 0;

    for (int i=1;i<=stoneLength; i++){
        newStoneLength = stone[0];
        if (newStoneLength < i+1){
            stone[0] = ++newStoneLength;
            stone[newStoneLength] = 0;
        }
        
        stone[i] += stoneCopy[i]*mul;
        
        spread(stone, i);
    }

    return stone;
}

long blink(long stone[], int times){
    
    if (times == 0){
        return 1;
    }

    //remove leading 0s
    int length = stone[0];
    while (length > 1 && stone[length] == 0){
        stone[0] = --length;
    }
    

    //if it's a 0, make it a 1
    if (length == 1 && stone[1] == 0){
        long newStone[100] = { 1, 1 };
        return blink(newStone, times-1);
    }

    //if it's even length, split it in 2 parts
    if ((length & 1) == 0){
        int newLength = length >> 1;
        long newStone1[100], newStone2[100];
        newStone1[0] = newLength;
        for (int i=1;i<=newLength;i++){
            newStone1[i] = stone[i];
        }
        newStone2[0] = newLength;
        for (int i=1; i<=newLength; i++){
            newStone2[i] = stone[newLength+i];
        }

        return blink(newStone1, times-1) + blink(newStone2, times-1);
    }
    

    //otherwise multiply by 2024
    multiply(stone, 2024);
    return blink(stone, times-1);

}


void *blink_thread(void *arg){

    long *stone = (long *)arg;
    long *result = malloc(sizeof(long));
    *result = blink(stone, numberOfBlinks);
    free(stone);

    pthread_exit((void *)result);
}


int main(){
    
    long result = 0;
    pthread_t threads[maxThreads];

    size_t fileLength;
    char *file;
    file = readStdIn(&fileLength);
    
    int a;
    int b = fileLength;
    while (b > -1){
        a = b-1;
        b = findPrevChar(file, fileLength, a, ' '); 
        
        long *stone = malloc(sizeof(long) * 100);

        //first element is the size of the number
        stone[0] = a-b;
        for (int i=a; i>b; i--){
            stone[1+a-i] = (long)file[i] - (long)'0';
        }
        printf(">>");
        printStone2(stone);
        printf("\n");

        if (pthread_create(&threads[threadCount], NULL, blink_thread, (void *)stone) != 0){
            perror("Error creating thread");
            free(stone);
            return 1;
        }

        if (++threadCount > maxThreads){
            return -1;
        }

    }

    for (int i=0; i<threadCount; i++){
        void* returnValue;

        if (pthread_join(threads[i], &returnValue) != 0){
            perror("Error joining thread");
            return 1;
        }

        result += *(long *)returnValue;

    }

    printf("%li\n",result);
    return 0;
}
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// finds the next space or newline char.
// Returns fileLength if no blank is found
int findNextBlank(char *file, long fileLength, int index)
{

   while (file[index] != ' ' && file[index] != '\n' && index < fileLength)
      index++;

   return index;
}

// finds the instance of a particular char in a char array
int findChar(char *file, long fileLength, int index, char find, int skip)
{

   while (index > -1 && index < fileLength && file[index] != find)
      index += skip;

   return index;
}

// finds the next instance of a particular char in a char array
// returns fileLength if not found
int findNextChar(char *file, long fileLength, int index, char find)
{
   return findChar(file, fileLength, index, find, 1);
}

// finds the previous instance of a particular char in a char array
// returns -1 if not found
int findPrevChar(char *file, long fileLength, int index, char find)
{
   return findChar(file, fileLength, index, find, -1);
}

char *readStdIn(size_t *fileLength)
{
   const long CHUNK_SIZE = 102400;
   char *buffer = malloc(0);
   size_t length = 0;
   size_t read = 0;
   do
   {
      buffer = realloc(buffer, length + CHUNK_SIZE);
      read = fread(buffer + length, 1, CHUNK_SIZE, stdin);
      length += read;
   } while (read == CHUNK_SIZE);

   *fileLength = length;
   return buffer;
}

int compareStr(char *str1, char *str2, int str1Start, int str2Start, int len)
{
   for (int i = 0; i < len; i++)
   {
      if (str1[i + str1Start] != str2[i + str2Start])
         return 0;
   }

   return 1;
}

/// @brief Parses an integer of known length
/// @param str
/// @param start
/// @param end
/// @return
int parseInt(char *str, int start, int end)
{
   int result = 0;
   for (int i = start; i <= end; i++)
   {
      if (str[i] < '0' || str[i] > '9')
         return -1;

      result = (10 * result) + str[i] - '0';
   }

   return result;
}

/// @brief Parses an integer of unknown length
/// @param str
/// @param start
/// @param strLen
/// @return
int parseInt2(char *str, int strLen, int start)
{
   int result = 0;
   for (int i = start; i < strLen && (str[i] >= '0' && str[i] <= '9'); i++)
   {
      result = (10 * result) + str[i] - '0';
   }

   return result;
}

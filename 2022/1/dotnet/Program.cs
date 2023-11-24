using System;
using System.IO;
using System.Linq;

class Program
{
    public static void Main()
    {
        try
        {
            using (var sr = new StreamReader("input.txt"))
            {
                int max = 0, current = 0;
                var line = "";
                while ((line = sr.ReadLine()) != null){
                    if (line == ""){
                        if (current > max){
                            max = current;
                        }
                        current = 0;
                        continue;
                    }

                    current += int.Parse(line);
                }

                Console.WriteLine("Part 1: " + max.ToString());

                sr.BaseStream.Position = 0;
                var result2 = sr.ReadToEnd()
                    .Split("\n\n")
                    .Select(x => x
                        .Split("\n")
                        .Select(y => int.Parse(y))
                        .Sum()
                    )
                    .OrderBy(y => -y)
                    .Take(3)
                    .Sum();

                Console.WriteLine("Part 2: " + result2.ToString());
            }
        }
        catch (IOException e)
        {
            Console.WriteLine("The file could not be read:");
            Console.WriteLine(e.Message);
        }
    }
}

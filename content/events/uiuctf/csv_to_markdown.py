import sys
import csv

TEAM_COLUMN = 1
AUTHOR_COLUMN = 2
CHALLENGE_COLUMN = 3
WRITEUP_LINK_COLUMN = 4

def main():
    with open(sys.argv[1], 'r', encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            print(f"| [{row[CHALLENGE_COLUMN]}]({row[WRITEUP_LINK_COLUMN]}) | {row[TEAM_COLUMN]} - {row[AUTHOR_COLUMN]} |")

if __name__ == "__main__":
    main()
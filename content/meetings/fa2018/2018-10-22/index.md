---
credit:
- Joseph Ravichandran
featured: false
recording: ''
slides: printf_meeting.pdf
assets:
- ./intro_to_reverse_engineering.pdf
- ./intro_to_unix_and_command_line.pdf
tags:
- pwn
- rev
- format strings
- printf
time_close: ''
time_start: 2018-10-22T18:00:00.000000Z
title: Format String Vulnerabilities
week_number: 8
---
## Useful `printf` format specifiers
- `%x`: print hexadecimal
- `%d`: print decimal
- `%s`: print string, given pointer to string on stack
- `%n`: store number of characters printed thus far into a pointer on the stack
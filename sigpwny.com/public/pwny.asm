; https://sigpwny.com/pwny.asm
; nasm -f elf64 pwny.asm
; ld pwny.o -o pwny
; ./pwny

global _start

section .data
flag:
  db "sigpwny{????????}", 10

section .text
_start:
  lea rsi, [flag]

  dw 1337 ; misalign next instruction
  mov rdi, 0x68000000 ; cmp [rip + 0xbf], eax
  mov rax, [rdi]
  xor eax, 0xbb48016a ; push 0x35078b48 ; push 1

  push rbp ; not real instructions, bytes for mov
  femms
  push rcx
  adc cl, [rdx + 10]
  add [rdx + 18], ch ; mov rbx 0x000a4a12510e0f55 ; push 18
  xor [rsi + 8], rbx
  pop rdx
  pop rdi

  mov rax, 1
  syscall
  mov rax, 60
  syscall
---
title: Linux Kernel Exploitation
time_start: 2024-03-24T19:00:00.000Z
time_close: ""
week_number: 9
credit:
  - Maxwell Bland
featured: true
location: Siebel CS 1404
live_video_url: https://illinois.zoom.us/j/85675793212?pwd=T3I2K3J1R0Q0aHo2UFQ2Wkk5ODNPZz09
tags:
  - pwn
  - kernel
  - linux
---
## Summary
Join Maxwell Bland, recent PhD graduate from UIUC, for a talk about contemporary Linux kernel exploitation strategies!

## Abstract 
The last five years have introduced extensive new subsystems to common Linux kernel downstreams, such as BPF, EROFS filesystems, and self-patching code. These new systems have introduced novel, unsolved threat vectors for the Linux kernels, and exploit chains targeting these subsystems are further exacerbated by existing exploits techniques targeting writable resources such as file operations structures, TRNG device pointers, and MMIO registers. While point-patches can and do mitigate a number of attack vectors, these do not systematically harden kernel maintenance procedures and infrastructure, resulting in the continued publicization of new exploits leveraging old techniques. This presentation dissects the anatomy of three recent high-profile kernel exploits and their mitigations, then rediscovers a number of memory management assumptions and microarchitecture-level kernel modifications (e.g. BPF-CFI) necessary to guarantee kernel security moving into the next decade. It ends by discussing a number of emerging exploit paths, steps for effective Linux kernel patch submissions and testing, and larger issues regarding the incorporation of patches into downstream projects like Android.
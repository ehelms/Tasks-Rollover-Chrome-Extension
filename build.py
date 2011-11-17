#!/usr/bin/env python
import os
from subprocess import call

BASE_DIR = os.chdir(os.path.dirname(os.path.abspath(__file__)))
BUILD_DIR = BASE_DIR + '/build'

print("Step 1: Creating archive from Git.")
call('git archive master --format=zip -o tasks_rollover.zip', shell=True)


print("Step 2: Opening zip and inserting credentials.")
call('mkdir ' + BUILD_DIR, shell=True)
call('mv tasks_rollover.zip ' + BUILD_DIR, shell=True)
call('cp oauth_credentials.js ' + BUILD_DIR, shell=True)
os.chdir(BUILD_DIR)
call('unzip tasks_rollover.zip', shell=True)
call('rm tasks_rollover.zip')
print("Step 3: Repackaging.")
os.chdir(BASE_DIR)
call('zip -r tasks_rollover.zip ' + BUILD_DIR, shell=True)

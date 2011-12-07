/*
Copyright 2011, Eric D. Helms

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var tasks_rolled_over = { rolled_over : false, timestamp : new Date(0) };

function notifyRolledOver(){
    var logo = 'images/rollover-clock_48x48.png',
        title = 'RollOver Success',
        body = 'Tasks successfully rolled over to current date';

    notify(logo, title, body);
};

var rollTasksOver = function(callback, manual){
    callback = callback || function(){};
    manual = manual || false;

    var today = new Date();

    if( tasks_rolled_over.timestamp.getTime() + 24*60*60*1000 <= today.getTime() ){
        tasks_rolled_over.rolled_over = false;
        tasks_rolled_over.timestamp = today;
    } 
    
    if( !tasks_rolled_over.rolled_over || manual ){
        getTasks(function(data){
            var length=data.items.length, 
                i=0,
                task,
                taskDate,
                notify = false;

            console.log('Checking for uncompleted tasks in the past')
            
            for( i=0; i < length; i +=1 ){
                task = data.items[i];
                
                if( task.due && !task.completed ){
                    taskDate = new Date(task.due);

                    if( ((taskDate.getDate() + 1) < today.getDate() && taskDate.getMonth() <= today.getMonth() && taskDate.getYear() <= today.getYear() ) || (taskDate.getMonth() < today.getMonth() && taskDate.getYear() <= today.getYear()) ){
                        console.log('Rolling task over');
                        taskDate.setMinutes(0);
                        taskDate.setHours(0);
                        taskDate.setSeconds(0);
                        taskDate.setFullYear(today.getFullYear());
                        taskDate.setDate(today.getDate());
                        taskDate.setMonth(today.getMonth());
                        task.due = taskDate.toISOString();
                        updateTask({ 'due' : task.due, "id" : task.id });
                        notify = true;
                    }
                }
            }

            if( notify ){
                tasks_rolled_over.rolled_over = true;
                notifyRolledOver();
            }
            
            callback();
        });
    } else {
        callback();
    }
};

function checkForCalendarUrl(tabId, changeInfo, tab) {
    if (tab.url.indexOf('https://www.google.com/calendar/') > -1) {
        if( changeInfo.status === 'loading' ){
            rollTasksOver();
        }
    }
};

function checkTasks(){
    console.log('Checking for tasks');
    rollTasksOver();
};

chrome.tabs.onUpdated.addListener(checkForCalendarUrl);
chrome.tabs.onSelectionChanged.addListener(checkTasks);

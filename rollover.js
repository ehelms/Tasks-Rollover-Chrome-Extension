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
function notifyRolledOver(){
    var logo = 'images/rollover-clock_48x48.png',
        title = 'RollOver Success',
        body = 'Tasks successfully rolled over to current date';

    notify(logo, title, body);
};

var rollTasksOver = function(data){
    var length=data.items.length, 
        i=0,
        task,
        taskDate,
        today,
        notify = false;

    today = new Date();
    
    for( i=0; i < length; i +=1 ){
        task = data.items[i];
        
        if( task.due && !task.completed ){
            taskDate = new Date(task.due);

            if( ((taskDate.getDate() + 1) < today.getDate() && taskDate.getMonth() <= today.getMonth) || taskDate.getMonth() < today.getMonth() ){
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
        notifyRolledOver();
    }
};

function checkForCalendarUrl(tabId, changeInfo, tab) {
    if (tab.url.indexOf('https://www.google.com/calendar/') > -1) {
        if( changeInfo.status === 'loading' ){
            getTasks(rollTasksOver);
        }
    }
};

function checkTasks(tabId, selectInfo){
    getTasks(rollTasksOver);
};

chrome.tabs.onUpdated.addListener(checkForCalendarUrl);
chrome.tabs.onSelectionChanged.addListener(checkTasks);

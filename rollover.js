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

var rollTasksOver = function(data){
    var length=data.items.length, 
        i=0,
        task,
        taskDate,
        today;

    today = new Date();

    for( i=0; i < length; i +=1 ){
        task = data.items[i];

        if( task.due && !task.completed ){
            taskDate = new Date(task.due);
            
            if( taskDate.getDate() !== today.getDate() ){
                taskDate.setDate(today.getDate() - 1);
                task.due = taskDate.toISOString();
                updateTask({ 'due' : task.due, "id" : task.id });
            }
        }
    }
};

function checkForCalendarUrl(tabId, changeInfo, tab) {
    if (tab.url.indexOf('https://www.google.com/calendar/') > -1 || tab.url.indexOf('https://mail.google.com/mail/') > -1) {
        getTasks(rollTasksOver);
        chrome.pageAction.show(tabId);
    }
};

chrome.tabs.onUpdated.addListener(checkForCalendarUrl);

var rollTasksOver = function(data){
    var length=data.items.length, 
        i=0,
        task,
        taskDate,
        today;

    today = new Date();

    for( i=0; i < length; i +=1 ){
        task = data.items[i];

        if( task.due ){
            taskDate = new Date(task.due);
            
            if( taskDate.getDate() !== today.getDate() ){
                taskDate.setDate(today.getDate() - 1);
                task.due = taskDate.toISOString();
                updateTask({ 'due' : task.due, "id" : task.id });
            }
        }
    }
};

function updateTask(task, cb) {
  var url = 'https://www.googleapis.com/tasks/v1/lists/@default/tasks/' + task.id;
  var req = {
    'method': 'PUT',
    'headers': {
      'Content-type': 'application/json'
    },
    'body': JSON.stringify(task)
  };

  var getDone = function(resp, xhr) {
    if (xhr.status != 200) {
      notifyFailure('Couldn\'t update tasks.', xhr.status);
    }

  }

  oauth.sendSignedRequest(url, getDone, req);
}

getTasks(rollTasksOver);

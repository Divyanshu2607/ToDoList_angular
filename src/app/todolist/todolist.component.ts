import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

interface Task {
  taskName: string;
  isCompleted: boolean;
  isEditable: boolean;
  history: string[];
}

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {
  taskArray: Task[] = [
    {
      taskName: 'Brush teeth',
      isCompleted: false,
      isEditable: false,
      history: ['Task created']
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    const newTask: Task = {
      taskName: form.controls['task'].value,
      isCompleted: false,
      isEditable: false,
      history: [`Task created with name: "${form.controls['task'].value}" at ${this.getCurrentTimeStamp()}`]
    };

    this.taskArray.push(newTask);
    form.reset();
  }

  onDelete(index: number) {
    this.addHistory(index, 'Task deleted');
    this.taskArray.splice(index, 1);
  }

  onCheck(index: number) {
    this.taskArray[index].isCompleted = !this.taskArray[index].isCompleted;
    const status = this.taskArray[index].isCompleted ? 'completed' : 'not completed';
    this.addHistory(index, `Task marked as ${status}`);
  }

  onEdit(index: number) {
    this.addHistory(index, 'Task is now editable');
    this.taskArray[index].isEditable = true;
  }

  onSave(index: number, newtask: string) {
    this.addHistory(index, `Task name changed to: "${newtask}"`);
    this.taskArray[index].taskName = newtask;
    this.taskArray[index].isEditable = false;
  }

  addHistory(index: number, action: string) {
    const timestamp = this.getCurrentTimeStamp();
    this.taskArray[index].history.push(`[${timestamp}] ${action}`);
  }

  getCurrentTimeStamp(): string {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    return `${date} ${time}`;
  }

  exportToCSV() {
    const csvRows = [];
    const headers = ['Task Name', 'Completed', 'Editable', 'History'];

    csvRows.push(headers.join(','));

    for (const task of this.taskArray) {
      const row = [
        task.taskName,
        task.isCompleted ? 'Yes' : 'No',
        task.isEditable ? 'Yes' : 'No',
        task.history.join('; ') // Join history with semicolons
      ];
      csvRows.push(row.join(','));
    }

    const csvString = csvRows.join('\n');
    this.downloadCSV(csvString);
  }

  downloadCSV(csvString: string) {
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }
}

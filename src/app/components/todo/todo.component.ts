import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { FilterType, TodoModel } from '../../models/todo';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {

    todolist= signal<TodoModel[]>([
      {
        id:1,
        title:'comprar leche',
        completed:false,
        editing:false,
      },
      {
        id:2,
        title:'hacer ejercicio',
        completed:false,
        editing:false,
      },
      {
        id:3,
        title:'comprar queso',
        completed:false,
        editing:false,
      },
      {
        id:4,
        title:'Aprender Angular',
        completed:true,
        editing:false,
      },
    ]);


    filter = signal<FilterType>('all');

    todoListFiltered = computed ( ()=>{
      const filter = this.filter();
      const todos = this.todolist();

      switch(filter){
        case 'active':
          return todos.filter( (todo)=> !todo.completed);
        case 'completed':
          return todos.filter ( (todo)=> todo.completed);
        default:
          return todos;     
      }
    })

    constructor (){
      effect( ()=>{
        localStorage.setItem('todo',JSON.stringify(this.todolist()));
      });
    }

    ngOnInit() {
      const storage= localStorage.getItem('todo');

      if(storage){
        this.todolist.set(JSON.parse(storage));
      }
    }




    newTodo = new FormControl('',{
      nonNullable:true,
      validators:[Validators.required, Validators.minLength(3)],
    });




    changeFilter(filterString:FilterType){
      this.filter.set(filterString);
    }
    

    addTodo(){
      const newTodoTitle = this.newTodo.value.trim();
      if( this.newTodo.valid && newTodoTitle !== ''){
        this.todolist.update( (prev_todos)=>{
          return[
            ...prev_todos,
            {id:Date.now(), title: newTodoTitle, completed:false}
          ];
        });
        this.newTodo.reset();
      }
      else{
        this.newTodo.reset(); 
      }
    }
    


  /*  toggleTodo(todoId:number){
      return this.todolist.update( (prev_todos)=>
      prev_todos.map(  (todo)=>{
        if(todo.id===todoId){
          return{
            ...todo,
            completed: !todo.completed,
          };
        }
        return {...todo};
      })
      )

    }*/

    toggleTodo(todoId:number){
      return this.todolist.update( (prev_todos)=>
      prev_todos.map(  (todo)=>{
        return todo.id===todoId
        ?{...todo, completed:!todo.completed}
        :todo;
      })
      );
    }
  


    removeTodo(todoId:number){
      this.todolist.update( (prev_todos)=>
      prev_todos.filter(  (todo)=> todo.id!==todoId)
      );
    }

    updateTodo(todoId:number){
      return this.todolist.update( (prev_todos)=>
      prev_todos.map( (todo)=>{
        return todo.id===todoId
        ? {...todo, editing:true}
        : {...todo, editing:false}
      })
      );
    }


    saveTitleTodo(todoId:number, event:Event){
      return this.todolist.update( (prev_todos)=>
      prev_todos.map( (todo)=>{
        return todo.id===todoId
        ? {...todo, title:(event.target as HTMLInputElement).value ,editing:false}
        : todo
      })
      );
    }



}

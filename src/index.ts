class Todo {
  private notes: Note[] = [];

  addNote(title: string, content: string, requiresConfirmation: boolean = false): void {
    if (title.trim() !== '' && content.trim() !== '') {
      const note = new Note(title, content, requiresConfirmation);
      this.notes.push(note);
    }
  }

  deleteNote(id: number): void {
    const index = this.findIndexById(id);
    if (index !== -1) {
      this.notes.splice(index, 1);
    }
  }

  getNoteById(id: number): Note | undefined {
    return this.notes.find(note => note.id === id);
  }

  getAllNotes(): Note[] {
    return this.notes;
  }

  markNoteAsDone(id: number): void {
    const index = this.findIndexById(id);
    if (index !== -1) {
      this.notes[index].status = 'Done';
    }
  }

  getTotalNoteCount(): number {
    return this.notes.length;
  }

  getRemainingNoteCount(): number {
    return this.notes.filter(note => note.status === 'Not Done').length;
  }

  searchNotes(searchParams: SearchParams): Note[] {
    return this.notes.filter(note => {
      return (
        (searchParams.title === undefined || note.title.includes(searchParams.title)) &&
        (searchParams.content === undefined || note.content.includes(searchParams.content))
      );
    });
  }

  sortNotes(sortingType: SortingType): void {
    this.notes.sort((a, b) => {
      if (sortingType === SortingType.ByStatus) {
        return a.status.localeCompare(b.status);
      } else {
        return a.creationDate.getTime() - b.creationDate.getTime();
      }
    });
  }

  private findIndexById(id: number): number {
    return this.notes.findIndex(note => note.id === id);
  }
}

class Note {
  static currentId = 1;
  public id: number;
  public creationDate: Date;
  public lastEdited: Date;
  public status: string;

  constructor(
    public title: string,
    public content: string,
    public requiresConfirmation: boolean
  ) {
    this.id = Note.currentId++;
    this.creationDate = new Date();
    this.lastEdited = this.creationDate;
    this.status = 'Not Done';
  }

  edit(title: string, content: string): void {
    if (this.requiresConfirmation) {
      console.log('Editing confirmation required...');
      // Logic for confirmation
    }
    this.title = title;
    this.content = content;
    this.lastEdited = new Date();
  }
}

enum SortingType {
  ByStatus,
  ByCreationDate,
}

interface SearchParams {
  title?: string;
  content?: string;
}

// Usage example:

const todo = new Todo();

todo.addNote('Complete the project', 'Finish project development');
todo.addNote('Prepare lunch', 'Spaghetti Bolognese', true);
todo.addNote('Clean the room', 'Tidy up the entire room');

todo.markNoteAsDone(1);
todo.getNoteById(2)?.edit('Prepare dinner', 'Pasta with tuna');
todo.deleteNote(3);

console.log('All notes:', todo.getAllNotes());
console.log('Note with ID 2:', todo.getNoteById(2));
console.log('Total number of notes:', todo.getTotalNoteCount());
console.log('Number of uncompleted notes:', todo.getRemainingNoteCount());

console.log("Search for notes containing the word 'prepare':", todo.searchNotes({ title: 'Prepare' }));
console.log('Sorting by status:');
todo.sortNotes(SortingType.ByStatus);
console.log(todo.getAllNotes());
console.log('Sorting by creation date:');
todo.sortNotes(SortingType.ByCreationDate);
console.log(todo.getAllNotes());

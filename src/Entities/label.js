export class Label {
    constructor(
        id = null,
        name,
        color,
        tasks = []
    ) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.tasks = tasks;
    }

    static fromJson(json) {
        return new Label(
            json.labelId,
            json.name,
            json.color,
            json.tasks?.map(task => Todo.fromJson(task)) || []
        );
    }

    toJson() {
        return {
            labelId: this.id,
            name: this.name,
            color: this.color,
            tasks: this.tasks.map(task => task.toJson())
        };
    }
}

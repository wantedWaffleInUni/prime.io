import styled from "styled-components";
import Card from "./SprintDragCard";
import './SprintScroll.css';
import { Droppable } from "react-beautiful-dnd";

const Container = styled.div`
    background-color: #f4f5f7;
    border-radius: 2.5px;
    width: 400px;
    height: 900px;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    border: 1px solid gray;
`;

const Title = styled.h3`
    padding: 8px;
    background-color: pink;
    text-align: center;
`;

const TaskList = styled.div`
    padding: 3px;
    transistion: background-color 0.2s ease;
    background-color: #f4f5f7;
    flex-grow: 1;
    min-height: 100px;
`;

interface ColumnProps {
    title: string;
    tasks: Task[];
    id: string;
}

interface Task {
    _id: string;
    id: number;
    taskNumber: number;
    taskName: string;
    taskPriority: string;
    taskStage: string;
    taskType: string;
    taskStatus: string;
    tags: { label: string; value: string };
    description: string;
    taskSize: number | null;
    taskAssignedto: { label: string; value: string };
    createdAt: Date;
    sprintStage: string;
    sprint: string;
  }


export default function SprintColumn({ title, tasks, id }: ColumnProps) {
    return (
        <Container className="column">
            <Title
                style={{
                    backgroundColor: "pink",
                    top: "0",
                }}
            >
                {title}
            </Title>
            <Droppable droppableId={id} type = 'group'>
                {(provided) => (
                    <TaskList
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {tasks.map((task) => (
                            <Card key={task.taskNumber} index={task.taskNumber} task={task} />
                        ))}
                        {provided.placeholder}
                    </TaskList>
                )}
            </Droppable>
        </Container>
    );
}
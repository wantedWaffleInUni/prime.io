import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { Avatar } from "antd";

const Container = styled.div<{ isDragging: boolean }>`
    border-radius: 10px;
    box-shadow: 5px 5px 5px 2px grey;
    padding: 8px;
    color: #000;
    margin-bottom: 8px;
    min-height: 120px;
    margin-left: 10px;
    margin-right: 10px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
`;

const TextContent = styled.div``;

const Icons = styled.div`
    display: flex;
    justify-content: end;
    padding: 2px;
`;
// function bgcolorChange(props) {
//     return props.isDragging
//         ? "lightgreen"
//         : props.isDraggable
//             ? props.isBacklog
//                 ? "#F2D7D5"
//                 : "#DCDCDC"
//             : props.isBacklog
//                 ? "#F2D7D5"
//                 : "#EAF4FC";
// }

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

interface CardProps {
    key: number;
    task: Task;
    index: number;
}

export default function Card({ key, task, index }: CardProps) {

    const getRowColor = (task: Task) => {
        switch (task.taskPriority) {
          case "Urgent":
            return "#ffa69e";
          case "Less Urgent":
            return "#fdffb6";
          case "Not Urgent":
            return "#caffbf";
          default:
            return "#bfbaba";
        }
      };

    return (
        <Draggable draggableId={`${task.taskNumber}`} key={key} index={index}>
            {(provided, snapshot) => (
                <Container
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    isDragging={snapshot.isDragging}
                >
                    <div style={{ display: "flex", justifyContent: "start", padding: 2 }}>
            <span>
              {/* <small>
                #{task.taskNumber}
                  {"  "}
              </small> */}
            </span>
                    </div>
                    <div>
                        <TextContent>
                        Task Number: {task.taskNumber} 
                        </TextContent>
                    </div>
                    <div
                        style={{ display: "flex", justifyContent: "center", padding: 2 , position: "sticky", top: "0", backgroundColor: getRowColor(task)}}
                    >
                        <TextContent>
                            {task.taskName}
                            </TextContent>
                    </div>
                    {/* <Icons>
                        <div>
                            <Avatar
                                onClick={() => console.log(task)}
                                src={"https://joesch.moe/api/v1/random?key=" + task.taskNumber}
                            />
                        </div>
                    </Icons> */}

                </Container>
            )}
        </Draggable>
    );
}
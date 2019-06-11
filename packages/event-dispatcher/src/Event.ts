export class Event {
    protected propagationStopped = false;

    public isPropagationStopped() {
        return this.propagationStopped;
    }

    public stopPropagation() {
        this.propagationStopped = true;
    }
}

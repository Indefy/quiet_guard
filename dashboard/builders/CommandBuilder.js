class CommandBuilder {
    constructor(command, user) {
      this.command = command;
      this.user = user || 'Unknown User';
      this.timestamp = new Date();
    }
  
    build() {
      return {
        command: this.command,
        user: this.user,
        timestamp: this.timestamp,
      };
    }
  }
  
  module.exports = CommandBuilder;
  
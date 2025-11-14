// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title HoneyProvenance
 * @dev Minimal smart contract for tracking honey batch provenance on-chain
 * Stores only content hashes (IPFS CIDs) to minimize gas costs
 */
contract HoneyProvenance {
    
    struct Event {
        uint256 timestamp;
        address actor;
        bytes32 ipfsHash;
        string eventType;
    }
    
    struct Batch {
        address producer;
        uint256 createdAt;
        bytes32 ipfsHash;
        bool exists;
    }
    
    // Mapping from batchId to Batch data
    mapping(bytes32 => Batch) public batches;
    
    // Mapping from batchId to array of events
    mapping(bytes32 => Event[]) public batchEvents;
    
    // Events for tracking
    event BatchCreated(
        bytes32 indexed batchId,
        address indexed producer,
        bytes32 ipfsHash,
        uint256 timestamp
    );
    
    event EventAdded(
        bytes32 indexed batchId,
        address indexed actor,
        bytes32 ipfsHash,
        string eventType,
        uint256 timestamp
    );
    
    /**
     * @dev Create a new honey batch
     * @param batchId Unique identifier for the batch
     * @param ipfsHash IPFS content hash containing batch metadata
     */
    function createBatch(bytes32 batchId, bytes32 ipfsHash) external {
        require(!batches[batchId].exists, "Batch already exists");
        require(ipfsHash != bytes32(0), "Invalid IPFS hash");
        
        batches[batchId] = Batch({
            producer: msg.sender,
            createdAt: block.timestamp,
            ipfsHash: ipfsHash,
            exists: true
        });
        
        emit BatchCreated(batchId, msg.sender, ipfsHash, block.timestamp);
    }
    
    /**
     * @dev Add an event to an existing batch
     * @param batchId The batch to add the event to
     * @param ipfsHash IPFS content hash containing event metadata
     * @param eventType Type of event (harvest, test, pack, ship, etc.)
     */
    function addEvent(
        bytes32 batchId,
        bytes32 ipfsHash,
        string calldata eventType
    ) external {
        require(batches[batchId].exists, "Batch does not exist");
        require(ipfsHash != bytes32(0), "Invalid IPFS hash");
        
        Event memory newEvent = Event({
            timestamp: block.timestamp,
            actor: msg.sender,
            ipfsHash: ipfsHash,
            eventType: eventType
        });
        
        batchEvents[batchId].push(newEvent);
        
        emit EventAdded(batchId, msg.sender, ipfsHash, eventType, block.timestamp);
    }
    
    /**
     * @dev Get all events for a batch
     * @param batchId The batch to query
     * @return Array of events
     */
    function getBatchEvents(bytes32 batchId) external view returns (Event[] memory) {
        require(batches[batchId].exists, "Batch does not exist");
        return batchEvents[batchId];
    }
    
    /**
     * @dev Get batch details
     * @param batchId The batch to query
     */
    function getBatch(bytes32 batchId) external view returns (
        address producer,
        uint256 createdAt,
        bytes32 ipfsHash,
        uint256 eventCount
    ) {
        require(batches[batchId].exists, "Batch does not exist");
        Batch memory batch = batches[batchId];
        return (
            batch.producer,
            batch.createdAt,
            batch.ipfsHash,
            batchEvents[batchId].length
        );
    }
}

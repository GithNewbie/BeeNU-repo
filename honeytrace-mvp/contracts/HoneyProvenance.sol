// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title HoneyProvenance
 * @dev Token-based honey provenance tracking with role-based operations
 * Factory → Seller → Consumer supply chain
 */
contract HoneyProvenance {
    
    // Roles
    enum Role { NONE, FACTORY, SELLER, CONSUMER }
    
    // Token metadata
    struct HoneyToken {
        uint256 tokenId;
        string batchNumber;
        string originLocation;
        uint256 creationTime;
        address currentOwner;
        bool exists;
        // Metadata
        uint256 moisture;
        uint256 weight;
        string qualityGrade;
    }
    
    // Trace event types
    enum EventType { CREATED, SELLER_BUY, TRANSFER, CONSUMER_BUY }
    
    // Trace event
    struct TraceEvent {
        EventType eventType;
        address actor;
        address from;
        address to;
        uint256 timestamp;
        string locationInfo;
    }
    
    // State variables
    uint256 public tokenCounter;
    mapping(address => Role) public roles;
    mapping(uint256 => HoneyToken) public tokens;
    mapping(uint256 => TraceEvent[]) public traces;
    
    // Events
    event HoneyCreated(
        uint256 indexed tokenId,
        address indexed factory,
        string batchNumber,
        uint256 timestamp
    );
    
    event HoneyMoved(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 timestamp,
        string locationInfo
    );
    
    event SellerBought(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 timestamp
    );
    
    event ConsumerBought(
        uint256 indexed tokenId,
        address indexed consumer,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyRole(Role _role) {
        require(roles[msg.sender] == _role, "Unauthorized role");
        _;
    }
    
    modifier tokenExists(uint256 _tokenId) {
        require(tokens[_tokenId].exists, "Token does not exist");
        _;
    }
    
    modifier onlyTokenOwner(uint256 _tokenId) {
        require(tokens[_tokenId].currentOwner == msg.sender, "Not token owner");
        _;
    }
    
    constructor() {
        // Constructor - roles assigned externally for MVP
    }
    
    /**
     * @dev Register a role (simplified for MVP - no access control)
     */
    function registerRole(address _user, Role _role) external {
        roles[_user] = _role;
    }
    
    /**
     * @dev Factory creates a new honey token
     */
    function createHoney(
        string memory _batchNumber,
        string memory _originLocation,
        uint256 _moisture,
        uint256 _weight,
        string memory _qualityGrade
    ) external onlyRole(Role.FACTORY) returns (uint256) {
        uint256 tokenId = tokenCounter++;
        
        tokens[tokenId] = HoneyToken({
            tokenId: tokenId,
            batchNumber: _batchNumber,
            originLocation: _originLocation,
            creationTime: block.timestamp,
            currentOwner: msg.sender,
            exists: true,
            moisture: _moisture,
            weight: _weight,
            qualityGrade: _qualityGrade
        });
        
        // Create trace event
        traces[tokenId].push(TraceEvent({
            eventType: EventType.CREATED,
            actor: msg.sender,
            from: address(0),
            to: msg.sender,
            timestamp: block.timestamp,
            locationInfo: _originLocation
        }));
        
        emit HoneyCreated(tokenId, msg.sender, _batchNumber, block.timestamp);
        
        return tokenId;
    }
    
    /**
     * @dev Seller buys honey from marketplace (simplified transfer)
     */
    function sellerBuyHoney(uint256 _tokenId) 
        external 
        onlyRole(Role.SELLER)
        tokenExists(_tokenId) 
    {
        address previousOwner = tokens[_tokenId].currentOwner;
        tokens[_tokenId].currentOwner = msg.sender;
        
        // Create trace event
        traces[_tokenId].push(TraceEvent({
            eventType: EventType.SELLER_BUY,
            actor: msg.sender,
            from: previousOwner,
            to: msg.sender,
            timestamp: block.timestamp,
            locationInfo: "Marketplace Purchase"
        }));
        
        emit SellerBought(_tokenId, msg.sender, block.timestamp);
        emit HoneyMoved(_tokenId, previousOwner, msg.sender, block.timestamp, "Marketplace Purchase");
    }
    
    /**
     * @dev Transfer honey between sellers or locations
     */
    function transferHoney(
        uint256 _tokenId,
        address _to,
        string memory _locationInfo
    ) 
        external 
        onlyRole(Role.SELLER)
        tokenExists(_tokenId)
        onlyTokenOwner(_tokenId)
    {
        require(roles[_to] == Role.SELLER, "Recipient must be seller");
        require(_to != msg.sender, "Cannot transfer to self");
        
        address previousOwner = tokens[_tokenId].currentOwner;
        tokens[_tokenId].currentOwner = _to;
        
        // Create trace event
        traces[_tokenId].push(TraceEvent({
            eventType: EventType.TRANSFER,
            actor: msg.sender,
            from: previousOwner,
            to: _to,
            timestamp: block.timestamp,
            locationInfo: _locationInfo
        }));
        
        emit HoneyMoved(_tokenId, previousOwner, _to, block.timestamp, _locationInfo);
    }
    
    /**
     * @dev Consumer buys honey (final step)
     */
    function consumerBuyHoney(uint256 _tokenId) 
        external 
        onlyRole(Role.CONSUMER)
        tokenExists(_tokenId)
    {
        address previousOwner = tokens[_tokenId].currentOwner;
        require(roles[previousOwner] == Role.SELLER, "Can only buy from seller");
        
        tokens[_tokenId].currentOwner = msg.sender;
        
        // Create trace event
        traces[_tokenId].push(TraceEvent({
            eventType: EventType.CONSUMER_BUY,
            actor: msg.sender,
            from: previousOwner,
            to: msg.sender,
            timestamp: block.timestamp,
            locationInfo: "Consumer Purchase"
        }));
        
        emit ConsumerBought(_tokenId, msg.sender, block.timestamp);
        emit HoneyMoved(_tokenId, previousOwner, msg.sender, block.timestamp, "Consumer Purchase");
    }
    
    /**
     * @dev Get complete trace history for a token
     */
    function getTrace(uint256 _tokenId) 
        external 
        view 
        tokenExists(_tokenId)
        returns (TraceEvent[] memory) 
    {
        return traces[_tokenId];
    }
    
    /**
     * @dev Get token details
     */
    function getToken(uint256 _tokenId) 
        external 
        view 
        tokenExists(_tokenId)
        returns (HoneyToken memory) 
    {
        return tokens[_tokenId];
    }
    
    /**
     * @dev Get role of an address
     */
    function getRole(address _user) external view returns (Role) {
        return roles[_user];
    }
}
